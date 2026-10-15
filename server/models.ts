import type { PoolClient } from 'pg';
import { query, queryOne, tx, nextSeq } from './db';
import {
  generateDefaultChapters,
  createDefault12MonthCalls,
  getAssignedIndexId,
  toMentorshipGroup,
  ProgramName,
  ProgramGroup,
} from '../src/shared/tracker';

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
export const digitsOf = (v: unknown) => String(v ?? '').replace(/\D/g, '');
export const last10 = (v: unknown) => digitsOf(v).slice(-10);
export const cleanEmail = (v: unknown) => String(v ?? '').trim().toLowerCase();
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export function isStudyIndexProduct(courseId?: string | null, courseName?: string | null): boolean {
  const cid = (courseId || '').toLowerCase();
  const cname = (courseName || '').toLowerCase();
  return (
    cid.startsWith('hk-studytrack') ||
    cid.includes('studytrack') ||
    cid === 'cs-study-progress-index' ||
    cid.includes('study-progress-index') ||
    cname.includes('studytrack') ||
    cname.includes('study progress index') ||
    cname.includes('progress index')
  );
}

export const avatarFor = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Student')}&background=C8A45D&color=000`;

export const iso = (d: any): string | undefined => (d ? new Date(d).toISOString() : undefined);

// ------------------------------------------------------------------
// Row -> API JSON mappers (camelCase, matches the React types)
// ------------------------------------------------------------------
export function mapPayment(p: any) {
  if (!p) return undefined;
  return {
    id: p.id,
    courseId: p.course_id,
    courseName: p.course_name,
    amount: Number(p.amount),
    discountCodeUsed: p.discount_code || undefined,
    discountAmount: Number(p.discount_amount || 0),
    finalAmount: Number(p.final_amount),
    orderId: p.order_id,
    paymentMethod: p.payment_method,
    paymentStatus: p.status,
    transactionRef: p.utr_number || undefined,
    utrNumber: p.utr_number || undefined,
    paymentDate: iso(p.created_at),
    paymentApprovedAt: p.status === 'approved' ? iso(p.reviewed_at) : undefined,
    rejectionReason: p.rejection_reason || undefined,
    rejectedAt: p.status === 'rejected' ? iso(p.reviewed_at) : undefined,
    paymentProofNotes: p.proof_notes || undefined,
    reviewedAt: iso(p.reviewed_at),
    reviewedBy: p.reviewed_by || undefined,
  };
}

export function mapStudent(s: any, latestPayment?: any, opts: { forStudent?: boolean } = {}) {
  return {
    studentId: s.student_code,
    fullName: s.full_name,
    email: s.email,
    phone: s.phone,
    program: s.program,
    level: s.level,
    group: s.group_name,
    targetExam: s.target_exam,
    avatar: s.avatar || undefined,
    registrationStatus: s.registration_status,
    registeredAt: iso(s.registered_at),
    registrationApprovedAt: iso(s.registration_approved_at),
    registrationRejectedAt: iso(s.registration_rejected_at),
    registrationRejectionReason: s.registration_rejection_reason || undefined,
    paymentStatus: s.payment_status,
    purchasedCourse: mapPayment(latestPayment),
    paymentApprovedAt: iso(s.payment_approved_at),
    paymentRejectedAt: iso(s.payment_rejected_at),
    paymentRejectionReason: s.payment_rejection_reason || undefined,
    mentorshipAccess: s.mentorship_access,
    assignedIndexId: s.assigned_index_id,
    studyIndexAccess: s.study_index_access,
    studyIndexRows: s.study_index_rows || [],
    trackerRows: s.tracker_rows || [],
    monthlyCalls: s.monthly_calls || [],
    adminNotes: opts.forStudent ? undefined : s.admin_notes || undefined,
    mentorRemarks: s.mentor_remarks || undefined,
    isActive: s.is_active,
    role: 'student' as const,
    hasPassword: Boolean(s.password_hash),
    lastLoginAt: iso(s.last_login_at),
    loginCount: s.login_count,
    updatedAt: iso(s.updated_at),
  };
}

export function mapOrder(p: any, s: any) {
  const items =
    Array.isArray(p.items) && p.items.length > 0
      ? p.items
      : [{ productId: p.course_id, name: p.course_name, price: Number(p.amount), quantity: 1 }];
  return {
    id: p.id,
    orderNumber: p.order_id,
    userId: s.student_code,
    items,
    subtotal: Number(p.amount),
    discount: Number(p.discount_amount || 0),
    tax: 0,
    totalAmount: Number(p.final_amount),
    paymentMethod: p.payment_method || 'UPI',
    utrNumber: p.utr_number || undefined,
    status: p.status === 'approved' ? 'COMPLETED' : p.status === 'rejected' ? 'FAILED' : 'PENDING_APPROVAL',
    createdAt: iso(p.created_at),
    approvedAt: p.status === 'approved' ? iso(p.reviewed_at) : undefined,
    billingDetails: { fullName: s.full_name, email: s.email, phone: s.phone },
  };
}

/** Shape used by the admin "UPI Payment Approvals" tab. */
export function mapAdminPayment(p: any) {
  const status = p.status === 'approved' ? 'approved' : p.status === 'rejected' ? 'rejected' : 'pending';
  const created = new Date(p.created_at);
  return {
    id: p.id,
    orderId: p.order_id,
    studentName: p.full_name,
    studentId: p.student_code,
    email: p.email,
    phone: p.phone,
    program: p.course_name,
    level: p.level,
    group: p.group_name,
    attempt: p.target_exam,
    amount: Number(p.final_amount),
    utrNumber: p.utr_number || '',
    paymentDate: created.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
    paymentTime: created.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
    status,
    rawStatus: p.status,
    createdAt: created.toISOString(),
    notes: p.proof_notes || '',
    rejectionReason: p.rejection_reason || '',
    productId: p.course_id,
  };
}

export function mapFreeBooking(b: any) {
  return {
    id: b.id,
    name: b.name,
    email: b.email,
    phone: b.phone,
    program: b.program,
    targetExam: b.target_exam || b.program,
    preferredSlot: b.preferred_slot,
    notes: b.notes || undefined,
    status: b.status,
    createdAt: iso(b.created_at),
    adminRemarks: b.admin_remarks || undefined,
  };
}

export function mapSlotBooking(b: any) {
  return {
    id: b.id,
    studentId: b.student_code || undefined,
    studentName: b.student_name,
    email: b.email,
    phone: b.phone,
    program: b.program,
    group: b.group_name,
    bookingDate: b.booking_date,
    bookingTime: b.booking_time,
    callType: b.call_type,
    notes: b.notes || undefined,
    status: b.status,
    createdAt: iso(b.created_at),
    adminRemarks: b.admin_remarks || undefined,
  };
}

export function mapInquiry(i: any) {
  return {
    id: i.id,
    kind: i.kind,
    activity_type: 'inquiry',
    name: i.name,
    email: i.email,
    phone: i.phone,
    program: i.program,
    attempt: i.attempt,
    subject_mode: i.subject_mode,
    selected_subjects: i.selected_subjects,
    product_id: i.product_id,
    notes: i.message || '',
    message: i.message || '',
    status: i.status,
    created_at: iso(i.created_at),
    updated_at: iso(i.updated_at),
  };
}

export function mapDiscount(c: any) {
  return {
    code: c.code,
    discountPercent: c.discount_percent,
    isUsed: c.is_used,
    isActive: c.is_active,
    isPermanentMultiUse: c.is_multi_use,
    usageCount: c.usage_count,
    usageLimit: c.usage_limit ?? undefined,
    usedByStudentId: c.used_by_student_code || undefined,
    usedByStudentName: c.used_by_name || undefined,
    usedByEmail: c.used_by_email || undefined,
    usedWithOrderId: c.used_with_order_id || undefined,
    usedAt: iso(c.used_at),
  };
}

// ------------------------------------------------------------------
// Student queries
// ------------------------------------------------------------------
export async function getStudentRowByCode(code: string) {
  return queryOne('select * from students where student_code = $1', [code]);
}

export async function getStudentRowById(id: string) {
  return queryOne('select * from students where id = $1', [id]);
}

export async function latestPayments(studentIds: string[]): Promise<Map<string, any>> {
  const map = new Map<string, any>();
  if (studentIds.length === 0) return map;
  const rows = await query(
    `select distinct on (student_id) * from payments where student_id = any($1::uuid[]) order by student_id, created_at desc`,
    [studentIds]
  );
  rows.forEach((r) => map.set(r.student_id, r));
  return map;
}

export async function loadStudentJson(row: any, opts: { forStudent?: boolean } = {}) {
  const map = await latestPayments([row.id]);
  return mapStudent(row, map.get(row.id), opts);
}

export async function listStudentsJson() {
  const rows = await query('select * from students order by created_at desc');
  const map = await latestPayments(rows.map((r) => r.id));
  return rows.map((r) => mapStudent(r, map.get(r.id)));
}

/** Recompute students.payment_status from that student's payments. */
export async function recomputePaymentStatus(client: PoolClient, studentId: string) {
  const { rows } = await client.query(
    `select status, max(reviewed_at) as at from payments where student_id = $1 group by status`,
    [studentId]
  );
  const has = (s: string) => rows.some((r) => r.status === s);
  const next = has('pending_approval') ? 'pending_approval' : has('approved') ? 'approved' : has('rejected') ? 'rejected' : 'unpaid';
  await client.query(`update students set payment_status = $2, updated_at = now() where id = $1`, [studentId, next]);
}

// ------------------------------------------------------------------
// Create student (register / manual add)
// ------------------------------------------------------------------
export interface NewStudentInput {
  fullName: string;
  email: string;
  phone: string;
  program: ProgramName;
  level: string;
  group: ProgramGroup;
  passwordHash?: string | null;
}

export async function insertStudent(client: PoolClient, input: NewStudentInput) {
  const seq = await nextSeq(client, 'student_code_seq');
  const code = `STU-${new Date().getFullYear()}-${String(seq).padStart(3, '0')}`;
  const assigned = getAssignedIndexId(input.program, input.group);
  const mg = toMentorshipGroup(input.group);
  const rows = generateDefaultChapters(input.program, mg);
  const { rows: out } = await client.query(
    `insert into students
       (student_code, full_name, email, phone, program, level, group_name, target_exam, avatar, password_hash,
        registration_status, registration_approved_at, assigned_index_id, tracker_rows, study_index_rows, monthly_calls)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'approved',now(),$11,$12::jsonb,$13::jsonb,$14::jsonb)
     returning *`,
    [
      code,
      input.fullName,
      input.email,
      input.phone,
      input.program,
      input.level,
      input.group,
      `${input.program} — ${input.group}`,
      avatarFor(input.fullName),
      input.passwordHash || null,
      assigned,
      JSON.stringify(rows),
      JSON.stringify(rows),
      JSON.stringify(createDefault12MonthCalls()),
    ]
  );
  return out[0];
}

/** Returns a message if email/phone is already used by another student. */
export async function findDuplicate(email: string, phone: string, exceptId?: string): Promise<string | null> {
  const e = await queryOne(`select id from students where lower(email) = $1 and ($2::uuid is null or id <> $2::uuid)`, [
    email,
    exceptId || null,
  ]);
  if (e) return `An account already exists with this email (${email}).`;
  const p10 = last10(phone);
  if (p10.length === 10) {
    const p = await queryOne(
      `select id from students where right(regexp_replace(phone,'\\D','','g'),10) = $1 and ($2::uuid is null or id <> $2::uuid)`,
      [p10, exceptId || null]
    );
    if (p) return `An account already exists with this phone number (${phone}).`;
  }
  return null;
}

// ------------------------------------------------------------------
// Payment approval / rejection (transactional)
// ------------------------------------------------------------------
export async function approvePaymentTx(client: PoolClient, payment: any, adminName: string) {
  await client.query(
    `update payments set status='approved', reviewed_by=$2, reviewed_at=now(), rejection_reason=null where id=$1`,
    [payment.id, adminName]
  );
  const student = (await client.query('select * from students where id=$1 for update', [payment.student_id])).rows[0];
  const studyIndex = isStudyIndexProduct(payment.course_id, payment.course_name);
  if (studyIndex) {
    const rows =
      Array.isArray(student.study_index_rows) && student.study_index_rows.length > 0
        ? student.study_index_rows
        : generateDefaultChapters(student.program, toMentorshipGroup(student.group_name));
    await client.query(
      `update students set study_index_access = true, study_index_rows = $2::jsonb, is_active = true,
              payment_approved_at = now(), payment_rejection_reason = null, updated_at = now() where id = $1`,
      [student.id, JSON.stringify(rows)]
    );
  } else {
    await client.query(
      `update students set mentorship_access = true, is_active = true,
              payment_approved_at = now(), payment_rejection_reason = null, updated_at = now() where id = $1`,
      [student.id]
    );
  }
  await recomputePaymentStatus(client, student.id);
  return { student, studyIndex };
}

export async function rejectPaymentTx(client: PoolClient, payment: any, adminName: string, reason: string) {
  const wasApproved = payment.status === 'approved';
  await client.query(
    `update payments set status='rejected', reviewed_by=$2, reviewed_at=now(), rejection_reason=$3 where id=$1`,
    [payment.id, adminName, reason]
  );
  if (wasApproved) {
    // Revoke only what THIS payment had granted
    if (isStudyIndexProduct(payment.course_id, payment.course_name)) {
      await client.query(`update students set study_index_access = false where id = $1`, [payment.student_id]);
    } else {
      await client.query(`update students set mentorship_access = false where id = $1`, [payment.student_id]);
    }
  }
  await client.query(
    `update students set payment_rejected_at = now(), payment_rejection_reason = $2, updated_at = now() where id = $1`,
    [payment.student_id, reason]
  );
  await recomputePaymentStatus(client, payment.student_id);
  const student = (await client.query('select * from students where id=$1', [payment.student_id])).rows[0];
  return { student };
}

export async function audit(action: string, by: string, details: Record<string, unknown>, ip?: string) {
  try {
    await query('insert into audit_logs (action, performed_by, details, ip) values ($1,$2,$3::jsonb,$4)', [
      action,
      by,
      JSON.stringify(details || {}),
      ip || null,
    ]);
  } catch (e: any) {
    console.warn('[audit] failed:', e?.message || e);
  }
}

export { tx, query, queryOne, nextSeq };
