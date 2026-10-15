import { Router } from 'express';
import { ah, bad, str, ipOf, HttpError, notFound, conflict } from '../http';
import { requireAdmin, resolveAdmin } from '../auth';
import {
  hashPassword, verifyPassword, fingerprint, signSession, setSessionCookie, clearSessionCookie, ADMIN_COOKIE, RateLimiter,
} from '../security';
import {
  query, queryOne, tx, cleanEmail, isEmail, digitsOf, findDuplicate, insertStudent, getStudentRowByCode,
  loadStudentJson, listStudentsJson, mapFreeBooking, mapSlotBooking, mapInquiry, mapDiscount, mapAdminPayment,
  mapOrder, approvePaymentTx, rejectPaymentTx, recomputePaymentStatus, audit, isStudyIndexProduct, avatarFor, iso,
} from '../models';
import { createResetLink } from './public';
import { mailPaymentApproved, mailPaymentRejected, mailPasswordReset } from '../mailer';
import { generateDefaultChapters, createDefault12MonthCalls, getAssignedIndexId, toMentorshipGroup } from '../../src/shared/tracker';

export const adminRouter = Router();

const ADMIN_TTL = 12 * 3600;
const adminLoginLimiter = new RateLimiter(6, 15 * 60 * 1000, 15 * 60 * 1000);

const PAYMENT_SELECT = `
  select p.*, s.full_name, s.student_code, s.email, s.phone, s.level, s.group_name, s.target_exam
  from payments p join students s on s.id = p.student_id`;

// ---------------------------------------------------------------
// Public admin endpoints
// ---------------------------------------------------------------
adminRouter.get('/status', ah(async (_req, res) => {
  const row = await queryOne('select count(*)::int as n from admins');
  res.json({ success: true, claimed: (row?.n || 0) > 0 });
}));

adminRouter.post('/login', ah(async (req, res) => {
  const identifier = str(req.body.emailOrPhone, 160).toLowerCase();
  const password = String(req.body.password || '');
  if (!identifier || !password) throw bad('Please enter your email/phone and password.');
  const key = `${ipOf(req)}|${identifier}`;
  const rl = adminLoginLimiter.check(key);
  if (!rl.ok) throw new HttpError(429, `Too many failed attempts. Please try again in ${rl.retryMinutes} minutes.`);

  const digits = digitsOf(identifier);
  const admin = identifier.includes('@')
    ? await queryOne('select * from admins where lower(email) = $1', [identifier])
    : digits.length >= 10
    ? await queryOne(`select * from admins where right(regexp_replace(phone,'\\D','','g'),10) = $1`, [digits.slice(-10)])
    : null;
  const ok = await verifyPassword(password, admin?.password_hash);
  if (!admin || !ok) {
    adminLoginLimiter.fail(key);
    await audit('ADMIN_LOGIN_FAILED', identifier, {}, ipOf(req));
    throw new HttpError(401, 'Admin email/phone or password is incorrect.');
  }
  adminLoginLimiter.clear(key);
  await query('update admins set last_login_at = now() where id = $1', [admin.id]);
  setSessionCookie(req, res, ADMIN_COOKIE, signSession({ r: 'admin', sub: admin.id, pv: fingerprint(admin.password_hash) }, ADMIN_TTL), ADMIN_TTL);
  await audit('ADMIN_LOGIN_SUCCESS', admin.email, {}, ipOf(req));
  res.json({
    success: true,
    message: 'Login successful! Welcome to the Admin Portal.',
    session: {
      adminName: admin.name,
      adminEmail: admin.email,
      adminPhone: admin.phone,
      loginTime: new Date().toISOString(),
    },
  });
}));

adminRouter.post('/logout', (req, res) => {
  clearSessionCookie(req, res, ADMIN_COOKIE);
  res.json({ success: true });
});

adminRouter.get('/me', ah(async (req, res) => {
  const a = await resolveAdmin(req);
  if (!a) return res.json({ success: true, session: null });
  res.json({
    success: true,
    session: { adminName: a.name, adminEmail: a.email, adminPhone: a.phone, loginTime: iso(a.last_login_at) || new Date().toISOString() },
  });
}));

// ---------------------------------------------------------------
// Everything below needs an admin session
// ---------------------------------------------------------------
adminRouter.use(requireAdmin);
const adminName = async (req: any) => (await resolveAdmin(req))?.name || 'Admin';
const adminEmail = async (req: any) => (await resolveAdmin(req))?.email || 'admin';

adminRouter.post('/change-password', ah(async (req, res) => {
  const a = await resolveAdmin(req);
  const current = String(req.body.currentPassword || '');
  const next = String(req.body.newPassword || '');
  if (next.length < 8) throw bad('Naor password must be at least 8 characters long.');
  if (!(await verifyPassword(current, a.password_hash))) throw new HttpError(401, 'Current password is incorrect.');
  const hash = await hashPassword(next);
  await query('update admins set password_hash = $2, updated_at = now() where id = $1', [a.id, hash]);
  setSessionCookie(req, res, ADMIN_COOKIE, signSession({ r: 'admin', sub: a.id, pv: fingerprint(hash) }, ADMIN_TTL), ADMIN_TTL);
  await audit('ADMIN_PASSWORD_CHANGED', a.email, {}, ipOf(req));
  res.json({ success: true, message: 'Password has been changed.' });
}));

// One call that returns everything the admin dashboard needs
adminRouter.get('/overview', ah(async (_req, res) => {
  const [students, payments, free, slots, inquiries, codes] = await Promise.all([
    listStudentsJson(),
    query(`${PAYMENT_SELECT} order by p.created_at desc`),
    query('select * from free_bookings order by created_at desc'),
    query(`select b.*, s.student_code from slot_bookings b left join students s on s.id = b.student_id order by b.created_at desc`),
    query('select * from inquiries order by created_at desc limit 1000'),
    query('select * from discount_codes order by created_at desc, code'),
  ]);
  res.json({
    success: true,
    students,
    payments: payments.map(mapAdminPayment),
    freeBookings: free.map(mapFreeBooking),
    slotBookings: slots.map(mapSlotBooking),
    inquiries: inquiries.map(mapInquiry),
    discountCodes: codes.map(mapDiscount),
  });
}));

// ---------------------------------------------------------------
// Students
// ---------------------------------------------------------------
adminRouter.get('/students', ah(async (_req, res) => {
  const students = await listStudentsJson();
  res.json({ success: true, count: students.length, data: students });
}));

adminRouter.get('/students/:code', ah(async (req, res) => {
  const s = await getStudentRowByCode(req.params.code);
  if (!s) throw notFound('Student not found.');
  res.json({ success: true, student: await loadStudentJson(s) });
}));

adminRouter.get('/students/:code/orders', ah(async (req, res) => {
  const s = await getStudentRowByCode(req.params.code);
  if (!s) throw notFound('Student not found.');
  const rows = await query('select * from payments where student_id = $1 order by created_at desc', [s.id]);
  res.json({ success: true, orders: rows.map((p) => mapOrder(p, s)) });
}));

adminRouter.post('/students', ah(async (req, res) => {
  const fullName = str(req.body.fullName, 120);
  const email = cleanEmail(req.body.email);
  const phone = str(req.body.phone, 30);
  const program = str(req.body.program, 40) || 'CS Executive';
  const level = str(req.body.level, 20) || 'Level 2';
  const group = str(req.body.group, 20) || 'Group 1';
  if (!fullName || !email || !phone) throw bad('Student name, email, and phone are required.');
  if (!isEmail(email)) throw bad('Please enter a valid email address.');
  if (digitsOf(phone).length < 10) throw bad('Please enter a valid 10-digit phone number.');
  const dup = await findDuplicate(email, phone);
  if (dup) throw conflict(dup);

  const approved = req.body.initialPaymentStatus === 'approved';
  const utr = digitsOf(req.body.utrNumber);
  const password = String(req.body.password || '');
  const passwordHash = password.length >= 6 ? await hashPassword(password) : null;
  const who = await adminName(req);

  const student = await tx(async (c) => {
    const s = await insertStudent(c, { fullName, email, phone, program: program as any, level, group: group as any, passwordHash });
    if (approved || utr || req.body.courseName) {
      const amount = Math.max(0, Number(req.body.amount) || 0);
      const seqRow = (await c.query(`select nextval('order_no_seq') as n`)).rows[0];
      const orderId = `ORD-${new Date().getFullYear()}-${seqRow.n}`;
      const p = (
        await c.query(
          `insert into payments (order_id, student_id, course_id, course_name, amount, final_amount, payment_method, utr_number, status, proof_notes)
           values ($1,$2,'manual_enrollment',$3,$4,$4,'UPI',$5,'pending_approval',$6) returning *`,
          [orderId, s.id, str(req.body.courseName, 300) || `${program} (${group}) Mentorship`, amount, utr || null, 'Added manually by admin']
        )
      ).rows[0];
      if (approved) await approvePaymentTx(c, p, who);
      else await recomputePaymentStatus(c, s.id);
    }
    return (await c.query('select * from students where id = $1', [s.id])).rows[0];
  });

  let setPasswordUrl: string | undefined;
  if (!passwordHash) {
    setPasswordUrl = await createResetLink(student.id, 7 * 24 * 60);
    if (req.body.sendEmail !== false) {
      mailPasswordReset({ fullName, email }, setPasswordUrl, 7 * 24 * 60, true)
        .catch((e) => console.warn('[mail] Set-password email failed:', e?.message || e));
    }
  }
  await audit('STUDENT_MANUAL_ADD', await adminEmail(req), { studentId: student.student_code, email }, ipOf(req));
  res.json({
    success: true,
    message: `Student ${fullName} has been added!`,
    student: await loadStudentJson(student),
    setPasswordUrl,
  });
}));

const S = {
  fullName: 'full_name', email: 'email', phone: 'phone', program: 'program', level: 'level', group: 'group_name',
  targetExam: 'target_exam', adminNotes: 'admin_notes',
} as const;

adminRouter.patch('/students/:code', ah(async (req, res) => {
  const s = await getStudentRowByCode(req.params.code);
  if (!s) throw notFound('Student not found.');
  const b = req.body || {};
  const sets: string[] = [];
  const vals: any[] = [];
  const add = (col: string, v: any, cast = '') => {
    vals.push(v);
    sets.push(`${col} = $${vals.length}${cast}`);
  };

  const next = {
    fullName: b.fullName !== undefined ? str(b.fullName, 120) : s.full_name,
    email: b.email !== undefined ? cleanEmail(b.email) : s.email,
    phone: b.phone !== undefined ? str(b.phone, 30) : s.phone,
    program: b.program !== undefined ? str(b.program, 40) : s.program,
    level: b.level !== undefined ? str(b.level, 20) : s.level,
    group: b.group !== undefined ? str(b.group, 20) : s.group_name,
  };
  if (!next.fullName) throw bad('Name cannot be empty.');
  if (!isEmail(next.email)) throw bad('Please enter a valid email address.');
  if (next.email !== s.email || next.phone !== s.phone) {
    const dup = await findDuplicate(next.email, next.phone, s.id);
    if (dup) throw conflict(dup);
  }
  (Object.keys(S) as (keyof typeof S)[]).forEach((k) => {
    if (b[k] !== undefined && k !== 'targetExam' && k !== 'adminNotes') add(S[k], (next as any)[k]);
  });
  if (b.adminNotes !== undefined) add('admin_notes', str(b.adminNotes, 3000));
  if (b.mentorRemarks !== undefined) add('mentor_remarks', str(b.mentorRemarks, 3000));

  const programOrGroupChanged = next.program !== s.program || next.group !== s.group_name;
  if (programOrGroupChanged) {
    add('assigned_index_id', getAssignedIndexId(next.program as any, next.group as any));
    const rows = generateDefaultChapters(next.program as any, toMentorshipGroup(next.group as any));
    if (b.trackerRows === undefined) add('tracker_rows', JSON.stringify(rows), '::jsonb');
    if (b.studyIndexRows === undefined) add('study_index_rows', JSON.stringify(rows), '::jsonb');
  }
  if (b.targetExam !== undefined) add('target_exam', str(b.targetExam, 200));
  else if (programOrGroupChanged) add('target_exam', `${next.program} — ${next.group}`);

  if (b.mentorshipAccess !== undefined) add('mentorship_access', Boolean(b.mentorshipAccess));
  if (b.studyIndexAccess !== undefined) add('study_index_access', Boolean(b.studyIndexAccess));
  if (['unpaid', 'pending_approval', 'approved', 'rejected'].includes(b.paymentStatus)) add('payment_status', b.paymentStatus);
  if (['approved', 'rejected', 'pending_approval'].includes(b.registrationStatus)) {
    add('registration_status', b.registrationStatus);
    if (b.registrationStatus === 'approved') {
      add('is_active', true);
      sets.push('registration_approved_at = now()');
    }
    if (b.registrationStatus === 'rejected') {
      add('is_active', false);
      sets.push('registration_rejected_at = now()');
      add('registration_rejection_reason', str(b.reason, 500) || 'Access revoked by administrator.');
    }
  }
  if (b.isActive !== undefined && b.registrationStatus === undefined) add('is_active', Boolean(b.isActive));
  if (Array.isArray(b.trackerRows)) add('tracker_rows', JSON.stringify(b.trackerRows), '::jsonb');
  if (Array.isArray(b.studyIndexRows)) add('study_index_rows', JSON.stringify(b.studyIndexRows), '::jsonb');
  if (Array.isArray(b.monthlyCalls)) add('monthly_calls', JSON.stringify(b.monthlyCalls), '::jsonb');
  if (b.fullName !== undefined) add('avatar', avatarFor(next.fullName));

  if (sets.length === 0) return res.json({ success: true, message: 'No changes were made.', student: await loadStudentJson(s) });
  sets.push('updated_at = now()');
  vals.push(s.id);
  const updated = await queryOne(`update students set ${sets.join(', ')} where id = $${vals.length} returning *`, vals);
  await audit('STUDENT_UPDATE', await adminEmail(req), { studentId: s.student_code, fields: Object.keys(b) }, ipOf(req));
  res.json({ success: true, message: 'Student details have been updated.', student: await loadStudentJson(updated) });
}));

adminRouter.delete('/students/:code', ah(async (req, res) => {
  const s = await getStudentRowByCode(req.params.code);
  if (!s) throw notFound('Student not found.');
  await query('delete from students where id = $1', [s.id]);
  await audit('STUDENT_DELETE', await adminEmail(req), { studentId: s.student_code, name: s.full_name, email: s.email }, ipOf(req));
  res.json({ success: true, message: 'Student hata dior gaor.' });
}));

adminRouter.post('/students/:code/study-index-access', ah(async (req, res) => {
  const s = await getStudentRowByCode(req.params.code);
  if (!s) throw notFound('Student not found.');
  const grant = req.body.grant !== undefined ? Boolean(req.body.grant) : !s.study_index_access;
  const rows =
    grant && (!Array.isArray(s.study_index_rows) || s.study_index_rows.length === 0)
      ? generateDefaultChapters(s.program, toMentorshipGroup(s.group_name))
      : s.study_index_rows;
  const updated = await queryOne(
    'update students set study_index_access = $2, study_index_rows = $3::jsonb, updated_at = now() where id = $1 returning *',
    [s.id, grant, JSON.stringify(rows)]
  );
  await audit('STUDY_INDEX_ACCESS', await adminEmail(req), { studentId: s.student_code, grant }, ipOf(req));
  res.json({ success: true, studyIndexAccess: grant, message: `Index access is now ${grant ? 'ON' : 'OFF'}.`, student: await loadStudentJson(updated) });
}));

adminRouter.post('/students/:code/reset-link', ah(async (req, res) => {
  const s = await getStudentRowByCode(req.params.code);
  if (!s) throw notFound('Student not found.');
  const url = await createResetLink(s.id, 24 * 60);
  mailPasswordReset({ fullName: s.full_name, email: s.email }, url, 24 * 60, !s.password_hash)
    .catch((e) => console.warn('[mail] Reset email failed:', e?.message || e));
  await audit('ADMIN_RESET_LINK', await adminEmail(req), { studentId: s.student_code }, ipOf(req));
  res.json({ success: true, resetUrl: url, message: 'Reset link created (valid for 24 hours and can be used once).' });
}));

// Approve/reject by student: acts on the latest pending payment (or grants access directly if none)
adminRouter.post('/students/:code/approve-payment', ah(async (req, res) => {
  const s = await getStudentRowByCode(req.params.code);
  if (!s) throw notFound('Student not found.');
  const who = await adminName(req);
  const result = await tx(async (c) => {
    const p = (await c.query(`select * from payments where student_id = $1 and status = 'pending_approval' order by created_at desc limit 1`, [s.id])).rows[0];
    if (p) {
      const r = await approvePaymentTx(c, p, who);
      return { payment: p, studyIndex: r.studyIndex };
    }
    await c.query(
      `update students set mentorship_access = true, payment_status = 'approved', payment_approved_at = now(), is_active = true, updated_at = now() where id = $1`,
      [s.id]
    );
    return { payment: null, studyIndex: false };
  });
  await audit('PAYMENT_APPROVE', await adminEmail(req), { studentId: s.student_code, order: result.payment?.order_id || 'direct' }, ipOf(req));
  if (result.payment) mailPaymentApproved({ fullName: s.full_name, email: s.email }, { orderId: result.payment.order_id, courseName: result.payment.course_name, finalAmount: Number(result.payment.final_amount) });
  const fresh = await getStudentRowByCode(req.params.code);
  res.json({
    success: true,
    message: `Payment for ${s.full_name} approved. ${result.studyIndex ? 'Study Progress Index (editable)' : 'Mentorship access'} unlocked.`,
    student: await loadStudentJson(fresh),
  });
}));

adminRouter.post('/students/:code/reject-payment', ah(async (req, res) => {
  const s = await getStudentRowByCode(req.params.code);
  if (!s) throw notFound('Student not found.');
  const reason = str(req.body.reason, 500) || 'Payment could not be verified in the bank records.';
  const who = await adminName(req);
  const p = await tx(async (c) => {
    const pay = (await c.query(`select * from payments where student_id = $1 and status = 'pending_approval' order by created_at desc limit 1`, [s.id])).rows[0];
    if (pay) await rejectPaymentTx(c, pay, who, reason);
    else {
      await c.query(`update students set payment_status = 'rejected', payment_rejected_at = now(), payment_rejection_reason = $2, updated_at = now() where id = $1`, [s.id, reason]);
    }
    return pay;
  });
  await audit('PAYMENT_REJECT', await adminEmail(req), { studentId: s.student_code, reason }, ipOf(req));
  mailPaymentRejected({ fullName: s.full_name, email: s.email }, { orderId: p?.order_id || '-', reason });
  const fresh = await getStudentRowByCode(req.params.code);
  res.json({ success: true, message: `${s.full_name} ka payment reject kar dior gaor.`, student: await loadStudentJson(fresh) });
}));

// ---------------------------------------------------------------
// Payments (UPI submissions)
// ---------------------------------------------------------------
adminRouter.get('/payments', ah(async (_req, res) => {
  const rows = await query(`${PAYMENT_SELECT} order by p.created_at desc`);
  res.json({ success: true, count: rows.length, data: rows.map(mapAdminPayment) });
}));

adminRouter.post('/payments/:id/approve', ah(async (req, res) => {
  const pay = await queryOne('select * from payments where id = $1', [req.params.id]);
  if (!pay) throw notFound('Payment not found.');
  if (pay.status === 'approved') return res.json({ success: true, message: 'This payment has already been approved.' });
  const who = await adminName(req);
  const { student, studyIndex } = await tx((c) => approvePaymentTx(c, pay, who));
  await audit('PAYMENT_APPROVE', await adminEmail(req), { studentId: student.student_code, order: pay.order_id, utr: pay.utr_number }, ipOf(req));
  mailPaymentApproved({ fullName: student.full_name, email: student.email }, { orderId: pay.order_id, courseName: pay.course_name, finalAmount: Number(pay.final_amount) });
  res.json({
    success: true,
    message: `Payment for ${student.full_name} approved. ${studyIndex ? 'Study Progress Index' : 'Mentorship'} access unlocked.`,
  });
}));

adminRouter.post('/payments/:id/reject', ah(async (req, res) => {
  const pay = await queryOne('select * from payments where id = $1', [req.params.id]);
  if (!pay) throw notFound('Payment not found.');
  const reason = str(req.body.reason, 500) || 'The payment UTR could not be verified in the bank records.';
  const who = await adminName(req);
  const { student } = await tx((c) => rejectPaymentTx(c, pay, who, reason));
  await audit('PAYMENT_REJECT', await adminEmail(req), { studentId: student.student_code, order: pay.order_id, reason }, ipOf(req));
  mailPaymentRejected({ fullName: student.full_name, email: student.email }, { orderId: pay.order_id, reason });
  res.json({ success: true, message: `Payment for ${student.full_name} was rejected.` });
}));

// ---------------------------------------------------------------
// Free 1-on-1 bookings
// ---------------------------------------------------------------
adminRouter.get('/free-bookings', ah(async (_req, res) => {
  const rows = await query('select * from free_bookings order by created_at desc');
  res.json({ success: true, count: rows.length, data: rows.map(mapFreeBooking) });
}));

const FREE_STATUSES = ['pending', 'booked', 'confirmed', 'rescheduled', 'completed', 'cancelled'];
adminRouter.patch('/free-bookings/:id', ah(async (req, res) => {
  const status = req.body.status;
  if (status !== undefined && !FREE_STATUSES.includes(status)) throw bad('Invalid status.');
  const row = await queryOne(
    `update free_bookings set status = coalesce($2, status),
            admin_remarks = case when $3::boolean then $4 else admin_remarks end, updated_at = now()
     where id = $1 returning *`,
    [req.params.id, status || null, req.body.adminRemarks !== undefined, str(req.body.adminRemarks, 1500) || null]
  );
  if (!row) throw notFound('Booking not mili.');
  res.json({ success: true, booking: mapFreeBooking(row) });
}));

adminRouter.delete('/free-bookings/:id', ah(async (req, res) => {
  const row = await queryOne('delete from free_bookings where id = $1 returning id', [req.params.id]);
  if (!row) throw notFound('Booking not mili.');
  res.json({ success: true });
}));

// ---------------------------------------------------------------
// Slot bookings (paid students)
// ---------------------------------------------------------------
adminRouter.get('/slot-bookings', ah(async (_req, res) => {
  const rows = await query(`select b.*, s.student_code from slot_bookings b left join students s on s.id = b.student_id order by b.created_at desc`);
  res.json({ success: true, data: rows.map(mapSlotBooking) });
}));

adminRouter.patch('/slot-bookings/:id', ah(async (req, res) => {
  const status = req.body.status;
  if (status !== undefined && !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) throw bad('Invalid status.');
  const row = await queryOne(
    `update slot_bookings set status = coalesce($2, status),
            admin_remarks = case when $3::boolean then $4 else admin_remarks end, updated_at = now()
     where id = $1 returning *`,
    [req.params.id, status || null, req.body.adminRemarks !== undefined, str(req.body.adminRemarks, 1500) || null]
  );
  if (!row) throw notFound('Booking not mili.');
  res.json({ success: true, booking: mapSlotBooking(row) });
}));

adminRouter.delete('/slot-bookings/:id', ah(async (req, res) => {
  const row = await queryOne('delete from slot_bookings where id = $1 returning id', [req.params.id]);
  if (!row) throw notFound('Booking not mili.');
  res.json({ success: true });
}));

// ---------------------------------------------------------------
// Inquiries
// ---------------------------------------------------------------
adminRouter.get('/inquiries', ah(async (_req, res) => {
  const rows = await query('select * from inquiries order by created_at desc limit 1000');
  res.json({ success: true, count: rows.length, data: rows.map(mapInquiry) });
}));

adminRouter.patch('/inquiries/:id', ah(async (req, res) => {
  const row = await queryOne(
    `update inquiries set status = coalesce($2, status), updated_at = now() where id = $1 returning *`,
    [req.params.id, str(req.body.status, 40) || null]
  );
  if (!row) throw notFound('Inquiry not mili.');
  res.json({ success: true, inquiry: mapInquiry(row) });
}));

adminRouter.delete('/inquiries/:id', ah(async (req, res) => {
  const row = await queryOne('delete from inquiries where id = $1 returning id', [req.params.id]);
  if (!row) throw notFound('Inquiry not mili.');
  res.json({ success: true });
}));

// ---------------------------------------------------------------
// Discount codes
// ---------------------------------------------------------------
adminRouter.get('/discount-codes', ah(async (_req, res) => {
  const rows = await query('select * from discount_codes order by created_at desc, code');
  res.json({ success: true, data: rows.map(mapDiscount) });
}));

adminRouter.post('/discount-codes', ah(async (req, res) => {
  const code = str(req.body.code, 40).toUpperCase().replace(/\s+/g, '');
  const percent = Math.floor(Number(req.body.discountPercent));
  const multi = Boolean(req.body.isPermanentMultiUse);
  const limit = multi ? null : Math.max(1, Math.floor(Number(req.body.usageLimit) || 1));
  if (!code) throw bad('Code ka naam enter.');
  if (!(percent >= 1 && percent <= 100)) throw bad('Discount must be between 1% and 100%.');
  const exists = await queryOne('select 1 from discount_codes where code = $1', [code]);
  if (exists) throw conflict(`Code ${code} already exists.`);
  await query('insert into discount_codes (code, discount_percent, is_multi_use, usage_limit) values ($1,$2,$3,$4)', [code, percent, multi, limit]);
  res.json({ success: true, message: `Promo code ${code} (${percent}% OFF) ban gaor!` });
}));

adminRouter.post('/discount-codes/:code/toggle', ah(async (req, res) => {
  const row = await queryOne('update discount_codes set is_active = not is_active where code = $1 returning *', [req.params.code.toUpperCase()]);
  if (!row) throw notFound('Code not found.');
  res.json({ success: true, code: mapDiscount(row) });
}));

adminRouter.post('/discount-codes/:code/reset', ah(async (req, res) => {
  const row = await queryOne(
    `update discount_codes set is_used = false, usage_count = 0, used_by_student_code = null, used_by_name = null,
            used_by_email = null, used_with_order_id = null, used_at = null where code = $1 returning *`,
    [req.params.code.toUpperCase()]
  );
  if (!row) throw notFound('Code not found.');
  res.json({ success: true, code: mapDiscount(row) });
}));

adminRouter.delete('/discount-codes/:code', ah(async (req, res) => {
  const row = await queryOne('delete from discount_codes where code = $1 returning code', [req.params.code.toUpperCase()]);
  if (!row) throw notFound('Code not found.');
  res.json({ success: true });
}));

// ---------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------
adminRouter.get('/audit-logs', ah(async (_req, res) => {
  const rows = await query('select * from audit_logs order by created_at desc limit 300');
  res.json({ success: true, data: rows });
}));
