import type { Request, Response, NextFunction } from 'express';
import { queryOne } from './db';
import { verifySession, fingerprint, parseCookies, STUDENT_COOKIE, ADMIN_COOKIE } from './security';

/** Returns the logged-in student's DB row (or null). Checks account is still active & password unchanged. */
export async function resolveStudent(req: Request): Promise<any | null> {
  const cached = (req as any)._student;
  if (cached !== undefined) return cached;
  const payload = verifySession(parseCookies(req)[STUDENT_COOKIE], 'student');
  let row: any = null;
  if (payload) {
    row = await queryOne('select * from students where id = $1', [payload.sub]);
    if (row && (fingerprint(row.password_hash) !== payload.pv || !row.is_active || row.registration_status === 'rejected')) row = null;
  }
  (req as any)._student = row;
  return row;
}

export async function resolveAdmin(req: Request): Promise<any | null> {
  const cached = (req as any)._admin;
  if (cached !== undefined) return cached;
  const payload = verifySession(parseCookies(req)[ADMIN_COOKIE], 'admin');
  let row: any = null;
  if (payload) {
    row = await queryOne('select * from admins where id = $1', [payload.sub]);
    if (row && fingerprint(row.password_hash) !== payload.pv) row = null;
  }
  (req as any)._admin = row;
  return row;
}

export const requireStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const s = await resolveStudent(req);
    if (!s) return res.status(401).json({ success: false, message: 'Please login karein.', code: 'LOGIN_REQUIRED' });
    next();
  } catch (e) {
    next(e);
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const a = await resolveAdmin(req);
    if (!a) return res.status(401).json({ success: false, message: 'The admin session has expired. Please log in again.', code: 'ADMIN_LOGIN_REQUIRED' });
    next();
  } catch (e) {
    next(e);
  }
};
