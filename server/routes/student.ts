import { Router } from 'express';
import { ah, bad, str, ipOf, HttpError, notFound } from '../http';
import { requireStudent, resolveStudent } from '../auth';
import {
  query, queryOne, tx, nextSeq, loadStudentJson, mapOrder, mapSlotBooking, digitsOf, isEmail, iso,
  mapPayment,
} from '../models';
import { evaluateCode } from './public';
import { mailPaymentSubmitted, mailSlotBooking } from '../mailer';

export const studentRouter = Router();
studentRouter.use(requireStudent);

studentRouter.get('/me', ah(async (req, res) => {
  const s = await resolveStudent(req);
  res.json({ success: true, student: await loadStudentJson(s, { forStudent: true }) });
}));

studentRouter.get('/orders', ah(async (req, res) => {
  const s = await resolveStudent(req);
  const rows = await query('select * from payments where student_id = $1 order by created_at desc', [s.id]);
  res.json({ success: true, orders: rows.map((p) => mapOrder(p, s)) });
}));

// ---------------------------------------------------------------
// Submit a UPI payment (UTR) — logged-in students only
// ---------------------------------------------------------------
studentRouter.post('/payments', ah(async (req, res) => {
  const s = await resolveStudent(req);
  const utr = digitsOf(req.body.utrNumber || req.body.transactionRef);
  if (utr.length < 10 || utr.length > 22) throw bad('Please enter a valid 12-digit UPI UTR / transaction reference.');

  const courseId = str(req.body.courseId, 200) || 'cs-mentorship';
  const courseName = str(req.body.courseName, 300) || 'CS Mentorship Course';
  const amount = Math.max(0, Number(req.body.amount) || 0);
  if (amount <= 0) throw bad('The order amount is invalid.');
  const items = Array.isArray(req.body.items)
    ? req.body.items.slice(0, 20).map((i: any) => ({
        productId: str(i.productId, 200),
        name: str(i.name, 300),
        price: Math.max(0, Number(i.price) || 0),
        quantity: Math.max(1, Math.min(50, Number(i.quantity) || 1)),
      }))
    : [];
  const notes = str(req.body.paymentProofNotes, 500);
  const codeIn = str(req.body.discountCode, 40).toUpperCase();

  const out = await tx(async (c) => {
    // Duplicate UTR guard (friendly message before hitting the unique index)
    const dupe = (await c.query(`select 1 from payments where utr_number = $1 and status <> 'rejected'`, [utr])).rows[0];
    if (dupe) throw new HttpError(409, 'This UTR has already been submitted. If this was a mistake, please contact us on WhatsApp.');

    let discountAmount = 0;
    let appliedCode: string | null = null;
    if (codeIn) {
      const cRow = (await c.query('select * from discount_codes where code = $1 for update', [codeIn])).rows[0];
      const verdict = evaluateCode(cRow, codeIn);
      if (!verdict.valid) throw bad(verdict.message);
      discountAmount = Math.round((amount * verdict.discountPercent) / 100);
      appliedCode = codeIn;
      const newCount = (cRow.usage_count || 0) + 1;
      const exhausted = !cRow.is_multi_use && newCount >= Math.max(1, cRow.usage_limit ?? 1);
      await c.query(
        `update discount_codes set usage_count = $2, is_used = $3, used_by_student_code = $4, used_by_name = $5,
                used_by_email = $6, used_at = now() where code = $1`,
        [codeIn, newCount, exhausted || cRow.is_used, s.student_code, s.full_name, s.email]
      );
    }
    const finalAmount = Math.max(0, amount - discountAmount);
    const seq = await nextSeq(c, 'order_no_seq');
    const orderId = `ORD-${new Date().getFullYear()}-${seq}`;
    if (appliedCode) await c.query('update discount_codes set used_with_order_id = $2 where code = $1', [appliedCode, orderId]);

    const p = (
      await c.query(
        `insert into payments (order_id, student_id, course_id, course_name, items, amount, discount_code, discount_amount,
                               final_amount, payment_method, utr_number, status, proof_notes)
         values ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9,'UPI',$10,'pending_approval',$11) returning *`,
        [orderId, s.id, courseId, courseName, JSON.stringify(items), amount, appliedCode, discountAmount, finalAmount, utr, notes || `UPI transfer, UTR: ${utr}`]
      )
    ).rows[0];
    await c.query(`update students set payment_status = 'pending_approval', updated_at = now() where id = $1`, [s.id]);
    return p;
  });

  mailPaymentSubmitted(
    { fullName: s.full_name, email: s.email, studentCode: s.student_code },
    { orderId: out.order_id, courseName: out.course_name, finalAmount: Number(out.final_amount), utr }
  );
  const fresh = await queryOne('select * from students where id = $1', [s.id]);
  res.json({
    success: true,
    message: `Payment submitted (UTR: ${utr}). Access will be unlocked after admin verification.`,
    order: mapOrder(out, s),
    payment: mapPayment(out),
    student: await loadStudentJson(fresh, { forStudent: true }),
  });
}));

// ---------------------------------------------------------------
// Study Progress Index — student can edit ONLY if admin gave access
// ---------------------------------------------------------------
studentRouter.put('/study-index', ah(async (req, res) => {
  const s = await resolveStudent(req);
  if (!s.study_index_access) {
    throw new HttpError(403, 'Index editing access is currently disabled. Please contact the Admin.');
  }
  const rows = req.body.rows;
  if (!Array.isArray(rows) || rows.length > 2000) throw bad('The index data is invalid.');
  const updated = await queryOne(
    'update students set study_index_rows = $2::jsonb, updated_at = now() where id = $1 returning updated_at',
    [s.id, JSON.stringify(rows)]
  );
  res.json({ success: true, message: 'Study progress has been saved.', updatedAt: iso(updated.updated_at) });
}));

// ---------------------------------------------------------------
// Mentorship call slot bookings (paid students)
// ---------------------------------------------------------------
studentRouter.get('/slot-bookings', ah(async (req, res) => {
  const s = await resolveStudent(req);
  const rows = await query(
    `select b.*, $2::text as student_code from slot_bookings b where student_id = $1 order by created_at desc`,
    [s.id, s.student_code]
  );
  res.json({ success: true, bookings: rows.map(mapSlotBooking) });
}));

studentRouter.post('/slot-bookings', ah(async (req, res) => {
  const s = await resolveStudent(req);
  if (!s.mentorship_access) throw new HttpError(403, 'Active mentorship is required to book a slot.');
  const bookingDate = str(req.body.bookingDate, 40);
  const bookingTime = str(req.body.bookingTime, 40);
  const callType = str(req.body.callType, 160);
  if (!bookingDate || !bookingTime) throw bad('Please select a date and time.');
  const seq = await nextSeq(null, 'slot_booking_seq');
  const id = `SLOT-${new Date().getFullYear()}-${String(seq).padStart(3, '0')}`;
  const row = await queryOne(
    `insert into slot_bookings (id, student_id, student_name, email, phone, program, group_name, booking_date, booking_time, call_type, notes)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning *`,
    [id, s.id, s.full_name, s.email, s.phone, s.program, s.group_name, bookingDate, bookingTime, callType, str(req.body.notes, 1000) || null]
  );
  mailSlotBooking({ id, studentName: s.full_name, email: s.email, bookingDate, bookingTime, callType });
  res.json({ success: true, message: `Slot booked for ${bookingDate} at ${bookingTime}.`, booking: mapSlotBooking({ ...row, student_code: s.student_code }) });
}));
