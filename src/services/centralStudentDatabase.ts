/**
 * HK Code of Rankers — Student / Booking / Payment data access (client side)
 *
 * SOURCE OF TRUTH = PostgreSQL database behind the Express API (/api/*).
 * This file does not contain a localStorage / JSON "database". It is only an in-memory
 * cache that displays data received from the server to the UI in sync.
 *
 *  - After admin login -> refreshAdminData() loads the complete overview from the DB.
 *  - After student login -> only the student's own record is kept in the cache.
 *  - Every change is saved to the server (DB), then the cache is refreshed.
 */

import {
  TrackerRow,
  MonthMentorshipRecord,
  StudentMentorshipProfile,
} from '../types/mentorship';
import {
  CURRENT_SYLLABUS_VERSION,
  getAssignedIndexId,
  toMentorshipGroup,
} from '../shared/tracker';
import { ICSI_OFFICIAL_SYLLABUS } from '../data/icsiOfficialSyllabus';
import { apiGet, apiPost, apiPut, apiPatch, adminApi, getActiveAdminSession } from '../lib/backend';

export { ICSI_OFFICIAL_SYLLABUS, getAssignedIndexId, toMentorshipGroup };

// ====================================================================
// Types
// ====================================================================

export type FreeSlotStatus = 'pending' | 'booked' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';

export interface FreeSlotBookingRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  targetExam?: string;
  preferredSlot: string;
  notes?: string;
  status: FreeSlotStatus;
  createdAt: string;
  adminRemarks?: string;
}

export type ProgramName = 'CS EET' | 'CS Executive' | 'CS Professional';
export type ProgramLevel = 'Level 1' | 'Level 2' | 'Level 3';
export type ProgramGroup = 'EET' | 'Group 1' | 'Group 2' | 'Both Groups';

export type RegistrationStatus = 'approved' | 'rejected' | 'pending_approval';
export type PaymentStatus = 'unpaid' | 'pending_approval' | 'approved' | 'rejected';

export interface PurchasedCourseInfo {
  id?: string;
  courseId: string;
  courseName: string;
  amount: number;
  discountCodeUsed?: string;
  discountAmount?: number;
  finalAmount: number;
  orderId: string;
  paymentMethod: string;
  paymentStatus?: PaymentStatus;
  transactionRef?: string; // 12-digit UPI UTR
  utrNumber?: string;
  paymentDate: string;
  paymentApprovedAt?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  paymentProofNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface SlotBookingRecord {
  id: string; // e.g. SLOT-2026-001
  studentId?: string;
  studentName: string;
  email: string;
  phone: string;
  program: string;
  group: string;
  bookingDate: string;
  bookingTime: string;
  callType: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  adminRemarks?: string;
}

export interface CentralStudent {
  studentId: string; // STU-2026-XXX
  fullName: string;
  email: string;
  phone: string;
  program: ProgramName;
  level: ProgramLevel;
  group: ProgramGroup;
  targetExam: string;
  /** Passwords are never sent to the browser. Present only for backward compatibility. */
  password?: string;
  hasPassword?: boolean;
  avatar?: string;

  registrationStatus: RegistrationStatus;
  registeredAt: string;
  registrationApprovedAt?: string;
  registrationRejectedAt?: string;
  registrationRejectionReason?: string;

  paymentStatus: PaymentStatus;
  purchasedCourse?: PurchasedCourseInfo;
  paymentApprovedAt?: string;
  paymentRejectedAt?: string;
  paymentRejectionReason?: string;

  mentorshipAccess: boolean;
  assignedIndexId: 'cseet' | 'exec-g1' | 'exec-g2' | 'exec-both' | 'prof-g1' | 'prof-g2' | 'prof-both';

  studyIndexAccess: boolean;
  studyIndexRows?: TrackerRow[];

  trackerRows: TrackerRow[];
  monthlyCalls: MonthMentorshipRecord[];

  adminNotes?: string;
  /** Mentor's overall remark — visible to the student too */
  mentorRemarks?: string;
  isActive: boolean;
  role: 'student';
  lastLoginAt?: string;
  loginCount?: number;
  updatedAt: string;
}

export interface DiscountCodeRecord {
  code: string;
  discountPercent: number;
  isUsed: boolean;
  isActive?: boolean;
  isPermanentMultiUse?: boolean;
  usageCount?: number;
  usageLimit?: number;
  usedByStudentId?: string;
  usedByStudentName?: string;
  usedByEmail?: string;
  usedWithOrderId?: string;
  usedAt?: string;
}

/** Row shown in Admin -> UPI Payment Approvals */
export interface DirectUpiSubmission {
  id: string;
  orderId?: string;
  studentName: string;
  studentId: string;
  email: string;
  phone: string;
  program: string;
  level: string;
  group: string;
  attempt: string;
  amount: number;
  utrNumber: string;
  paymentDate: string;
  paymentTime: string;
  status: 'pending' | 'approved' | 'rejected';
  rawStatus?: string;
  createdAt: string;
  notes?: string;
  rejectionReason?: string;
  productId?: string;
}

export interface InquiryRow {
  id: string;
  kind?: string;
  activity_type?: string;
  student_id?: string;
  name: string;
  email?: string;
  phone: string;
  program?: string;
  attempt?: string;
  notes?: string;
  message?: string;
  status?: string;
  product_id?: string;
  created_at?: string;
}

export type ActionResult = { success: boolean; message: string };

// ====================================================================
// In-memory cache (filled from the database via the API)
// ====================================================================

interface Store {
  students: CentralStudent[];
  freeBookings: FreeSlotBookingRecord[];
  slotBookings: SlotBookingRecord[];
  payments: DirectUpiSubmission[];
  inquiries: InquiryRow[];
  discountCodes: DiscountCodeRecord[];
  adminLoaded: boolean;
}

const emptyStore = (): Store => ({
  students: [],
  freeBookings: [],
  slotBookings: [],
  payments: [],
  inquiries: [],
  discountCodes: [],
  adminLoaded: false,
});

let store: Store = emptyStore();
const DB_EVENT = 'hk-central-db-changed';

export function notifyDbChange() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(DB_EVENT));
}

export function subscribeToDatabaseChanges(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(DB_EVENT, callback);
  return () => window.removeEventListener(DB_EVENT, callback);
}

/** Forget everything in memory (call on logout). */
export function clearLocalCache(opts: { keepAdmin?: boolean } = {}) {
  store = opts.keepAdmin && store.adminLoaded ? { ...emptyStore(), ...store, students: store.students } : emptyStore();
  notifyDbChange();
}

function upsertStudent(s: CentralStudent) {
  const i = store.students.findIndex((x) => x.studentId === s.studentId);
  if (i >= 0) store.students[i] = s;
  else store.students.unshift(s);
}

/** Optimistic in-memory update (UI shows the change instantly; server save follows). */
export function patchStudentInCache(studentId: string, patch: Partial<CentralStudent>) {
  const i = store.students.findIndex((x) => x.studentId === studentId);
  if (i >= 0) store.students[i] = { ...store.students[i], ...patch, updatedAt: new Date().toISOString() };
  notifyDbChange();
}

/** Student portal: put the logged-in student's own record in the cache. */
export function setCurrentStudent(s: CentralStudent | null) {
  if (s) upsertStudent(s);
  notifyDbChange();
}

// ====================================================================
// Loading from DB
// ====================================================================

export async function refreshAdminData(): Promise<boolean> {
  const r = await adminApi('GET', '/api/admin/overview');
  if (!r.ok) return false;
  const d = r.data as any;
  store = {
    students: d.students || [],
    freeBookings: d.freeBookings || [],
    slotBookings: d.slotBookings || [],
    payments: d.payments || [],
    inquiries: d.inquiries || [],
    discountCodes: d.discountCodes || [],
    adminLoaded: true,
  };
  notifyDbChange();
  return true;
}

/** Backward-compatible name: loads all students (admin) from the database. */
export async function fetchStudentsFromCloud(): Promise<CentralStudent[]> {
  await refreshAdminData();
  return store.students;
}

/** Reload one student (works for admin and for the logged-in student). */
export async function refreshStudent(studentId: string): Promise<CentralStudent | null> {
  const admin = getActiveAdminSession();
  const r = admin
    ? await adminApi('GET', `/api/admin/students/${encodeURIComponent(studentId)}`)
    : await apiGet('/api/student/me');
  if (r.ok && r.data.student) {
    upsertStudent(r.data.student);
    notifyDbChange();
    return r.data.student;
  }
  return null;
}

// ====================================================================
// Getters (sync, read from cache)
// ====================================================================

export const getAllStudents = (): CentralStudent[] => store.students;
export const getAllFreeSlotBookings = (): FreeSlotBookingRecord[] => store.freeBookings;
export const getAllSlotBookings = (): SlotBookingRecord[] => store.slotBookings;
export const getAllPayments = (): DirectUpiSubmission[] => store.payments;
export const getAllInquiries = (): InquiryRow[] => store.inquiries;
export const getDiscountCodes = (): DiscountCodeRecord[] => store.discountCodes;

export function getStudentById(studentId: string): CentralStudent | null {
  return store.students.find((s) => s.studentId === studentId) || null;
}

export function getStudentByEmail(email: string): CentralStudent | null {
  const clean = (email || '').trim().toLowerCase();
  return store.students.find((s) => s.email.toLowerCase() === clean) || null;
}

export function toMentorshipProfile(student: CentralStudent): StudentMentorshipProfile {
  const isApproved = Boolean(student.mentorshipAccess || student.paymentStatus === 'approved');
  return {
    studentId: student.studentId,
    studentName: student.fullName,
    studentEmail: student.email,
    studentPhone: student.phone,
    program: student.program,
    level: student.level,
    group: toMentorshipGroup(student.group),
    assignedIndexId: student.assignedIndexId,
    targetAttempt: student.targetExam,
    syllabusVersion: CURRENT_SYLLABUS_VERSION,
    trackerRows: student.trackerRows || [],
    studyIndexRows: student.studyIndexRows || [],
    monthlyCalls: student.monthlyCalls || [],
    studyIndexAccess: student.studyIndexAccess,
    adminOverallRemarks: student.mentorRemarks || '',
    isApproved,
    approvalStatus: isApproved ? 'approved' : student.paymentStatus === 'rejected' ? 'rejected' : 'pending',
    approvedAt: student.paymentApprovedAt || student.registrationApprovedAt || student.registeredAt,
    updatedAt: student.updatedAt,
  };
}

export function isStudyIndexProduct(courseId?: string, courseName?: string): boolean {
  if (!courseId && !courseName) return false;
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

/** Approved purchase of HK StudyTrack Pro – CS Progress Index (or admin-granted index access). */
export function hasEligibleStudyTrackPurchase(
  student?: CentralStudent | null,
  additionalOrders?: Array<{ status?: string; items?: Array<{ productId?: string; name?: string }> }>
): boolean {
  if (!student) return false;
  if (student.studyIndexAccess) return true;
  const course = student.purchasedCourse;
  const isApproved = student.paymentStatus === 'approved' || course?.paymentStatus === 'approved';
  if (isApproved && isStudyIndexProduct(course?.courseId, course?.courseName)) return true;
  if (additionalOrders && additionalOrders.length > 0) {
    return additionalOrders.some(
      (o) =>
        (o.status === 'COMPLETED' || o.status === 'approved') &&
        o.items?.some((i) => isStudyIndexProduct(i.productId, i.name))
    );
  }
  return false;
}

// ====================================================================
// Admin mutations (all persisted in the DB first, then cache refreshed)
// ====================================================================

async function adminAction(
  method: string,
  path: string,
  body?: unknown,
  refresh = true
): Promise<ActionResult & { data: any }> {
  const r = await adminApi(method, path, body);
  if (r.ok && refresh) await refreshAdminData();
  return { success: r.ok, message: r.message, data: r.data };
}

const enc = encodeURIComponent;

export async function approveStudentPayment(studentId: string): Promise<ActionResult> {
  const r = await adminAction('POST', `/api/admin/students/${enc(studentId)}/approve-payment`, {});
  return { success: r.success, message: r.message };
}

export async function rejectStudentPayment(studentId: string, reason: string): Promise<ActionResult> {
  const r = await adminAction('POST', `/api/admin/students/${enc(studentId)}/reject-payment`, { reason });
  return { success: r.success, message: r.message };
}

export async function approvePaymentById(paymentId: string): Promise<ActionResult> {
  const r = await adminAction('POST', `/api/admin/payments/${enc(paymentId)}/approve`, {});
  return { success: r.success, message: r.message };
}

export async function rejectPaymentById(paymentId: string, reason: string): Promise<ActionResult> {
  const r = await adminAction('POST', `/api/admin/payments/${enc(paymentId)}/reject`, { reason });
  return { success: r.success, message: r.message };
}

export async function approveStudentRegistration(studentId: string): Promise<ActionResult> {
  const r = await adminAction('PATCH', `/api/admin/students/${enc(studentId)}`, { registrationStatus: 'approved' });
  return { success: r.success, message: r.message || 'Access restored.' };
}

export async function rejectStudentRegistration(studentId: string, reason: string): Promise<ActionResult> {
  const r = await adminAction('PATCH', `/api/admin/students/${enc(studentId)}`, { registrationStatus: 'rejected', reason });
  return { success: r.success, message: r.message || 'Access revoked.' };
}

export async function deleteStudentFromCentralDb(studentId: string): Promise<boolean> {
  return (await adminAction('DELETE', `/api/admin/students/${enc(studentId)}`)).success;
}

export async function toggleStudentActiveStatus(studentId: string): Promise<boolean> {
  const s = getStudentById(studentId);
  if (!s) return false;
  return (await adminAction('PATCH', `/api/admin/students/${enc(studentId)}`, { isActive: !s.isActive })).success;
}

export async function toggleStudentStudyIndexAccess(studentId: string, grant?: boolean): Promise<boolean> {
  const r = await adminAction('POST', `/api/admin/students/${enc(studentId)}/study-index-access`, grant === undefined ? {} : { grant });
  return r.success;
}

export interface ManualStudentInput {
  fullName: string;
  email: string;
  phone: string;
  program: ProgramName;
  level: ProgramLevel;
  group: ProgramGroup;
  password?: string;
  initialPaymentStatus?: 'unpaid' | 'pending_approval' | 'approved';
  courseName?: string;
  amount?: number;
  utrNumber?: string;
}

export async function addStudentManually(
  input: ManualStudentInput,
  opts: { skipRefresh?: boolean; sendEmail?: boolean } = {}
): Promise<ActionResult & { student?: CentralStudent; setPasswordUrl?: string }> {
  const r = await adminAction(
    'POST',
    '/api/admin/students',
    { ...input, sendEmail: opts.sendEmail },
    !opts.skipRefresh
  );
  return { success: r.success, message: r.message, student: r.data?.student, setPasswordUrl: r.data?.setPasswordUrl };
}

/** Generic admin edit of a student (profile, access, payment status, tracker data …). */
export async function updateStudentAccessDetails(
  studentId: string,
  updates: Partial<{
    fullName: string;
    email: string;
    phone: string;
    program: ProgramName;
    level: ProgramLevel;
    group: ProgramGroup;
    targetExam: string;
    mentorshipAccess: boolean;
    studyIndexAccess: boolean;
    paymentStatus: PaymentStatus;
    registrationStatus: RegistrationStatus;
    adminNotes: string;
    mentorRemarks: string;
    isActive: boolean;
    trackerRows: TrackerRow[];
    studyIndexRows: TrackerRow[];
    monthlyCalls: MonthMentorshipRecord[];
  }>
): Promise<ActionResult & { student?: CentralStudent }> {
  const r = await adminAction('PATCH', `/api/admin/students/${enc(studentId)}`, updates);
  return { success: r.success, message: r.message, student: r.data?.student };
}

export const updateStudentTrackerRows = (studentId: string, trackerRows: TrackerRow[]) =>
  updateStudentAccessDetails(studentId, { trackerRows });

export const updateStudentMonthlyCalls = (studentId: string, monthlyCalls: MonthMentorshipRecord[]) =>
  updateStudentAccessDetails(studentId, { monthlyCalls });

/**
 * Save Study Progress Index rows.
 * Student: allowed only when admin has enabled index access. Admin: can edit any student.
 */
export async function updateStudentStudyIndexRows(
  studentIdOrEmail: string,
  rows: TrackerRow[]
): Promise<ActionResult> {
  const key = (studentIdOrEmail || '').trim();
  const student = getStudentById(key) || getStudentByEmail(key);
  if (!student) return { success: false, message: 'Student record not found.' };
  if (!student.studyIndexAccess) {
    return { success: false, message: 'Index editing access is currently disabled. Please contact the Admin.' };
  }
  if (getActiveAdminSession()) {
    const r = await adminApi('PATCH', `/api/admin/students/${enc(student.studentId)}`, { studyIndexRows: rows });
    if (r.ok && r.data.student) upsertStudent(r.data.student);
    notifyDbChange();
    return { success: r.ok, message: r.ok ? 'Study progress has been saved.' : r.message };
  }
  const r = await apiPut('/api/student/study-index', { rows });
  if (r.ok) {
    upsertStudent({ ...student, studyIndexRows: rows, updatedAt: r.data.updatedAt || student.updatedAt });
    notifyDbChange();
  }
  return { success: r.ok, message: r.message };
}

/** Logged-in student submits a UPI payment (UTR). Amounts/discount are re-checked by the server. */
export async function submitCoursePayment(input: {
  courseId: string;
  courseName: string;
  amount: number;
  utrNumber: string;
  discountCode?: string;
  items?: Array<{ productId: string; name: string; price: number; quantity: number }>;
  paymentProofNotes?: string;
}): Promise<ActionResult & { order?: any; student?: CentralStudent }> {
  const r = await apiPost('/api/student/payments', input);
  if (r.ok && r.data.student) setCurrentStudent(r.data.student);
  return { success: r.ok, message: r.message, order: r.data?.order, student: r.data?.student };
}

export async function createPasswordResetLinkForStudent(studentId: string): Promise<{ success: boolean; message: string; resetUrl?: string }> {
  const r = await adminApi('POST', `/api/admin/students/${enc(studentId)}/reset-link`, {});
  return { success: r.ok, message: r.message, resetUrl: r.data?.resetUrl };
}

// ---- Slot bookings (paid students) ----
export async function updateSlotBookingStatus(
  id: string,
  status: SlotBookingRecord['status'],
  adminRemarks?: string
): Promise<boolean> {
  return (await adminAction('PATCH', `/api/admin/slot-bookings/${enc(id)}`, { status, adminRemarks })).success;
}
export async function deleteSlotBooking(id: string): Promise<boolean> {
  return (await adminAction('DELETE', `/api/admin/slot-bookings/${enc(id)}`)).success;
}

// ---- Free 1-on-1 bookings (public website form) ----
export async function updateFreeSlotBookingStatus(
  id: string,
  status: FreeSlotStatus,
  adminRemarks?: string
): Promise<boolean> {
  return (await adminAction('PATCH', `/api/admin/free-bookings/${enc(id)}`, { status, adminRemarks })).success;
}
export async function deleteFreeSlotBooking(id: string): Promise<boolean> {
  return (await adminAction('DELETE', `/api/admin/free-bookings/${enc(id)}`)).success;
}

// ---- Inquiries ----
export async function updateInquiryStatusInDb(id: string, status: string): Promise<boolean> {
  return (await adminAction('PATCH', `/api/admin/inquiries/${enc(id)}`, { status })).success;
}
export async function deleteInquiryFromDb(id: string): Promise<boolean> {
  return (await adminAction('DELETE', `/api/admin/inquiries/${enc(id)}`)).success;
}

// ---- Discount codes ----
export async function validateDiscountCode(
  code: string
): Promise<{ valid: boolean; discountPercent: number; message: string }> {
  const r = await apiPost('/api/discounts/validate', { code });
  if (!r.ok) return { valid: false, discountPercent: 0, message: r.message };
  return { valid: Boolean(r.data.valid), discountPercent: r.data.discountPercent || 0, message: r.data.message || '' };
}

export async function addCustomDiscountCode(
  code: string,
  discountPercent: number,
  isPermanentMultiUse = false,
  usageLimit?: number
): Promise<ActionResult> {
  const r = await adminAction('POST', '/api/admin/discount-codes', {
    code,
    discountPercent,
    isPermanentMultiUse,
    usageLimit,
  });
  return { success: r.success, message: r.message };
}

export async function toggleDiscountCodeStatus(code: string): Promise<boolean> {
  return (await adminAction('POST', `/api/admin/discount-codes/${enc(code)}/toggle`, {})).success;
}

export async function resetOrDeleteDiscountCode(code: string, deleteCode = false): Promise<boolean> {
  return deleteCode
    ? (await adminAction('DELETE', `/api/admin/discount-codes/${enc(code)}`)).success
    : (await adminAction('POST', `/api/admin/discount-codes/${enc(code)}/reset`, {})).success;
}
