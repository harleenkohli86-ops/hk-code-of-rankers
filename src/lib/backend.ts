/**
 * Browser-side access to the HK backend.
 * All data comes from the server's PostgreSQL database — there is no localStorage "database" here.
 */
import { useSyncExternalStore } from 'react';
import { api, apiGet, apiPost, apiPut, apiPatch, apiDelete, ApiResult } from './api';
import type { FreeSlotBookingRecord } from '../services/centralStudentDatabase';

// ====================================================================
// Admin session (server-side httpOnly cookie; only the display info is kept in memory)
// ====================================================================
export interface AdminSession {
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  loginTime: string;
  /** kept for backward compatibility with older components — cookie is used for auth, not this. */
  token?: string;
}

let adminSession: AdminSession | null = null;
let adminSessionChecked = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function setAdminSessionInternal(s: AdminSession | null) {
  adminSession = s;
  adminSessionChecked = true;
  emit();
}

export function getActiveAdminSession(): AdminSession | null {
  return adminSession;
}

/** Called by the API layer when the server says the admin session is gone. */
export function expireAdminSession() {
  if (adminSession) setAdminSessionInternal(null);
}

let restorePromise: Promise<void> | null = null;
/** Asks the server "am I logged in as admin?" (once). */
export function restoreAdminSession(force = false): Promise<void> {
  if (restorePromise && !force) return restorePromise;
  restorePromise = apiGet('/api/admin/me').then((r) => {
    const s = r.data?.session;
    setAdminSessionInternal(r.ok && s ? { ...s, token: 'cookie' } : null);
  });
  return restorePromise;
}

/** React hook: current admin session + whether the first server check finished. */
export function useAdminSession(): { session: AdminSession | null; checked: boolean } {
  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  };
  const session = useSyncExternalStore(subscribe, () => adminSession, () => null);
  const checked = useSyncExternalStore(subscribe, () => adminSessionChecked, () => false);
  if (!adminSessionChecked) void restoreAdminSession();
  return { session, checked };
}

export async function checkMasterAdminSlotStatus(): Promise<{ claimed: boolean }> {
  const r = await apiGet('/api/admin/status');
  return { claimed: r.ok ? Boolean(r.data.claimed) : true };
}

export async function loginMasterAdmin(
  emailOrPhone: string,
  password: string
): Promise<{ success: boolean; message: string; session?: AdminSession }> {
  const r = await apiPost('/api/admin/login', { emailOrPhone, password });
  if (r.ok && r.data.session) {
    const session: AdminSession = { ...r.data.session, token: 'cookie' };
    setAdminSessionInternal(session);
    return { success: true, message: r.message, session };
  }
  return { success: false, message: r.message || 'Invalid administrator credentials.' };
}

export async function logoutMasterAdmin(): Promise<void> {
  await apiPost('/api/admin/logout', {});
  setAdminSessionInternal(null);
}

/** Admin API call that also logs the admin out in the UI if the server session expired. */
export async function adminApi<T = any>(method: string, path: string, body?: unknown): Promise<ApiResult<T>> {
  const r = await api<T>(method, path, body);
  if (r.status === 401 && (r.data as any)?.code === 'ADMIN_LOGIN_REQUIRED') expireAdminSession();
  return r;
}

// ====================================================================
// Public forms (no login needed)
// ====================================================================
export interface SaveEnrollmentResult {
  success: boolean;
  message: string;
  savedToDb: boolean; // kept for old components: true == saved in the database
  id?: string;
}

/** Contact form / join-mentorship form / newsletter -> `inquiries` table. */
export async function saveEnrollment(data: {
  name: string;
  email?: string;
  phone: string;
  program: string;
  attempt?: string;
  subjectMode?: string;
  selectedSubjects?: string[];
  notes?: string;
  productId?: string;
  kind?: 'inquiry' | 'mentorship_enquiry' | 'contact' | 'newsletter';
}): Promise<SaveEnrollmentResult> {
  const kind =
    data.kind ||
    (data.productId === 'newsletter-subscriber'
      ? 'newsletter'
      : data.productId === 'inquiry-lead'
      ? 'contact'
      : 'mentorship_enquiry');
  const r = await apiPost('/api/inquiries', {
    kind,
    name: data.name,
    email: data.email,
    phone: data.phone === 'N/A' ? '' : data.phone,
    program: data.program,
    attempt: data.attempt,
    subjectMode: data.subjectMode,
    selectedSubjects: data.selectedSubjects,
    notes: data.notes,
    productId: data.productId,
  });
  return { success: r.ok, message: r.message, savedToDb: r.ok, id: r.data?.id };
}

/** Public FREE 1-on-1 guidance call booking -> `free_bookings` table (admin sees it instantly). */
export async function saveCounsellingBooking(data: {
  name: string;
  email?: string;
  phone: string;
  examLevel: string;
  date: string;
  notes?: string;
}): Promise<{ success: boolean; message: string; booking?: FreeSlotBookingRecord }> {
  const r = await apiPost('/api/bookings/free', {
    name: data.name,
    email: data.email,
    phone: data.phone,
    examLevel: data.examLevel,
    date: data.date,
    notes: data.notes,
  });
  return { success: r.ok, message: r.message, booking: r.data?.booking };
}

/** Parses preferred slot string into date + time parts (display helper). */
export function parseSlotDateTime(slotString: string): { selectedDate: string; selectedTime: string } {
  if (!slotString) return { selectedDate: 'Upcoming', selectedTime: 'Flexible' };
  const parenMatch = slotString.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch) return { selectedDate: parenMatch[1].trim(), selectedTime: parenMatch[2].trim() };
  const atMatch = slotString.match(/^(.*?)\s+at\s+(.*)$/i);
  if (atMatch) return { selectedDate: atMatch[1].trim(), selectedTime: atMatch[2].trim() };
  return { selectedDate: slotString, selectedTime: 'Confirmed on Call' };
}

// ====================================================================
// Inquiries (admin)
// ====================================================================
export interface InquiryRecord {
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
export type AppointmentRecord = InquiryRecord;

export async function updateInquiryStatus(id: string, status: string): Promise<boolean> {
  const r = await adminApi('PATCH', `/api/admin/inquiries/${encodeURIComponent(id)}`, { status });
  return r.ok;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const r = await adminApi('DELETE', `/api/admin/inquiries/${encodeURIComponent(id)}`);
  return r.ok;
}

/** Shows a red banner (see SaveErrorBanner in App) when a background save fails. */
export function reportSaveError(message: string) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('hk-save-error', { detail: message }));
}

export { apiGet, apiPost, apiPut, apiPatch, apiDelete };
