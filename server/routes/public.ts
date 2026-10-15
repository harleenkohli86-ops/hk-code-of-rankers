import { Router } from 'express';
import {
  ah, bad, str, ipOf, HttpError,
} from '../http';
import {
  hashPassword, verifyPassword, fingerprint, signSession, verifySession, parseCookies,
  setSessionCookie, clearSessionCookie, STUDENT_COOKIE, RateLimiter, ipLimiter, randomToken, sha256,
} from '../security';
import {
  query, queryOne, tx, nextSeq, cleanEmail, isEmail, digitsOf, findDuplicate, insertStudent,
  loadStudentJson, mapFreeBooking, mapDiscount, audit,
} from '../models';
import { mailNewRegistration, mailFreeBooking, mailInquiry, mailPasswordReset } from '../mailer';
import { config } from '../config';
import { resolveStudent } from '../auth';

export const publicRouter = Router();

const STUDENT_TTL = 30 * 24 * 3600;
const loginLimiter = new RateLimiter(8, 15 * 60 * 1000, 15 * 60 * 1000);
const publicWriteLimiter = ipLimiter(30, 10 * 60 * 1000);
const authLimiter = ipLimiter(40, 10 * 60 * 1000);

const PROGRAMS = ['CS EET', 'CS Executive', 'CS Professional'];
const GROUPS = ['EET', 'Group 1', 'Group 2', 'Both Groups'];
const LEVELS = ['Level 1', 'Level 2', 'Level 3'];

function startSession(req: any, res: any, s: any) {
  const token = signSession({ r: 'student', sub: s.id, pv: fingerprint(s.password_hash) }, STUDENT_TTL);
  setSessionCookie(req, res, STUDENT_COOKIE, token, STUDENT_TTL);
}

// ---------------------------------------------------------------
// Student auth
// ---------------------------------------------------------------
publicRouter.post('/auth/register', authLimiter, ah(async (req, res) => {
  const fullName = str(req.body.fullName, 120);
  const email = cleanEmail(req.body.email);
  const phone = digitsOf(req.body.phone).slice(-15);
  const password = String(req.body.password || '');
  let program = str(req.body.program, 40);
  let group = str(req.body.group, 20);
  let level = str(req.body.level, 20);

  if (!fullName || !email || !phone || !password) throw bad('Name, email, phone, and password are required.');
  if (!isEmail(email)) throw bad('Please enter a valid email address.');
  if (phone.length < 10) throw bad('Please enter a valid 10-digit phone number.');
  if (password.length < 6) throw bad('Password must be at least 6 characters long.');
  if (!PROGRAMS.includes(program)) program = 'CS Executive';
  if (!GROUPS.includes(group)) group = program === 'CS EET' ? 'EET' : 'Group 1';
  if (!LEVELS.includes(level)) level = program === 'CS EET' ? 'Level 1' : program === 'CS Professional' ? 'Level 3' : 'Level 2';

  const dup = await findDuplicate(email, phone);
  if (dup) throw new HttpError(409, `${dup} Please login karein.`);

  const passwordHash = await hashPassword(password);
  const student = await tx((c) =>
    insertStudent(c, { fullName, email, phone, program: program as any, level, group: group as any, passwordHash })
  );
  await query('update students set last_login_at = now(), login_count = 1 where id = $1', [student.id]);
  startSession(req, res, student);
  mailNewRegistration({
    studentCode: student.student_code, fullName, email, phone, program, group,
  });
  res.json({
    success: true,
    message: `Account ban gaor! Welcome to HK Code of Rankers, ${fullName}.`,
    student: await loadStudentJson(student, { forStudent: true }),
  });
}));

publicRouter.post('/auth/login', authLimiter, ah(async (req, res) => {
  const identifier = str(req.body.emailOrPhone, 160).toLowerCase();
  const password = String(req.body.password || '');
  if (!identifier || !password) throw bad('Please enter your email/phone and password.');

  const key = `${ipOf(req)}|${identifier}`;
  const rl = loginLimiter.check(key);
  if (!rl.ok) throw new HttpError(429, `Too many failed attempts. Please try again in ${rl.retryMinutes} minutes.`);

  const digits = digitsOf(identifier);
  const student = identifier.includes('@')
    ? await queryOne('select * from students where lower(email) = $1', [identifier])
    : digits.length >= 10
    ? await queryOne(`select * from students where right(regexp_replace(phone,'\\D','','g'),10) = $1`, [digits.slice(-10)])
    : null;

  const ok = await verifyPassword(password, student?.password_hash);
  if (!student || (!ok && student.password_hash)) {
    loginLimiter.fail(key);
    throw new HttpError(401, 'Email/phone or password is incorrect.');
  }
  if (!student.password_hash) {
    throw new HttpError(403, 'Your password has not been set. Use "Forgot Password" to set a new password.', {
      needsPasswordSetup: true,
    });
  }
  if (!student.is_active || student.registration_status === 'rejected') {
    throw new HttpError(403, 'Aapka account inactive hai. Please Harkiran Ma\'am ki team se contact karein.');
  }
  loginLimiter.clear(key);
  await query('update students set last_login_at = now(), login_count = login_count + 1 where id = $1', [student.id]);
  startSession(req, res, student);
  res.json({
    success: true,
    message: `Welcome back, ${student.full_name}!`,
    student: await loadStudentJson(student, { forStudent: true }),
  });
}));

publicRouter.post('/auth/logout', (req, res) => {
  clearSessionCookie(req, res, STUDENT_COOKIE);
  res.json({ success: true });
});

publicRouter.get('/auth/me', ah(async (req, res) => {
  const s = await resolveStudent(req);
  if (!s) return res.json({ success: true, student: null });
  res.json({ success: true, student: await loadStudentJson(s, { forStudent: true }) });
}));

const RESET_MINUTES = 60;

/** Creates a single-use reset token and returns the full URL (used by forgot-password and by admin). */
export async function createResetLink(studentId: string, minutes = RESET_MINUTES): Promise<string> {
  const token = randomToken(32);
  await query('update password_resets set used_at = now() where student_id = $1 and used_at is null', [studentId]);
  await query(
    `insert into password_resets (token_hash, student_id, expires_at) values ($1,$2, now() + ($3 || ' minutes')::interval)`,
    [sha256(token), studentId, String(minutes)]
  );
  const origin = config.appUrl;
  return `${origin}/student-portal?resetToken=${token}`;
}

publicRouter.post('/auth/forgot-password', authLimiter, ah(async (req, res) => {
  const email = cleanEmail(req.body.email);
  if (!email || !isEmail(email)) throw bad('Registered email address enter.');
  const student = await queryOne('select * from students where lower(email) = $1', [email]);
  if (student && student.is_active) {
    const url = await createResetLink(student.id);
    const delivered = await mailPasswordReset({ fullName: student.full_name, email: student.email }, url, RESET_MINUTES);
    if (!delivered) console.error(`[mail] Reset email not delivered for ${student.email}; token remains valid for 60 minutes.`);
    await audit('STUDENT_RESET_REQUESTED', student.email, { studentId: student.student_code }, ipOf(req));
  }
  // Keep the response identical for registered and unknown addresses so it does
  // not reveal which student accounts exist. Do not claim delivery: providers
  // can accept the request before final inbox delivery.
  res.json({
    success: true,
    message: `If ${email} is registered, a password reset request has been received. Please check your Inbox and Spam folder for the link (valid for 60 minutes).`,
  });
}));

publicRouter.post('/auth/reset-password', authLimiter, ah(async (req, res) => {
  const token = str(req.body.token, 200);
  const newPassword = String(req.body.newPassword || '');
  if (!token) throw bad('Reset token is missing.');
  if (newPassword.length < 6) throw bad('New password must be at least 6 characters long.');
  const rec = await queryOne('select * from password_resets where token_hash = $1', [sha256(token)]);
  if (!rec) throw bad('The reset link is invalid.');
  if (rec.used_at) throw bad('This reset link has already been used.');
  if (new Date(rec.expires_at).getTime() < Date.now()) throw bad('This reset link has expired. Please request a new link.');
  const hash = await hashPassword(newPassword);
  await tx(async (c) => {
    await c.query('update students set password_hash = $2, updated_at = now() where id = $1', [rec.student_id, hash]);
    await c.query('update password_resets set used_at = now() where student_id = $1 and used_at is null', [rec.student_id]);
  });
  res.json({ success: true, message: 'Password has been reset! Please log in now.' });
}));

// ---------------------------------------------------------------
// Public: free one-to-one booking
// ---------------------------------------------------------------
publicRouter.post('/bookings/free', publicWriteLimiter, ah(async (req, res) => {
  const name = str(req.body.name, 120);
  const email = cleanEmail(req.body.email);
  const phone = str(req.body.phone, 30);
  const program = str(req.body.program || req.body.examLevel, 160);
  const slot = str(req.body.preferredSlot || req.body.date, 160) || '1-on-1 Guidance Session';
  const notes = str(req.body.notes, 1500);

  if (!name) throw bad('Name is required.');
  if (digitsOf(phone).length < 10) throw bad('valid 10-digit WhatsApp / mobile number enter.');
  if (email && !isEmail(email)) throw bad('Please enter a valid email address.');

  const seq = await nextSeq(null, 'free_booking_seq');
  const id = `FREE-${new Date().getFullYear()}-${String(seq).padStart(3, '0')}`;
  const row = await queryOne(
    `insert into free_bookings (id, name, email, phone, program, target_exam, preferred_slot, notes, status)
     values ($1,$2,$3,$4,$5,$5,$6,$7,'booked') returning *`,
    [id, name, email, phone, program, slot, notes || null]
  );
  mailFreeBooking({ id, name, email, phone, program, preferredSlot: slot, notes });
  res.json({ success: true, message: 'Free guidance slot booked!', booking: mapFreeBooking(row) });
}));

// ---------------------------------------------------------------
// Public: inquiries / leads (contact form, join-mentorship form, newsletter)
// ---------------------------------------------------------------
publicRouter.post('/inquiries', publicWriteLimiter, ah(async (req, res) => {
  const name = str(req.body.name, 120);
  const email = cleanEmail(req.body.email);
  const phone = str(req.body.phone, 30);
  const kind = ['inquiry', 'mentorship_enquiry', 'contact', 'newsletter'].includes(req.body.kind) ? req.body.kind : 'inquiry';
  const program = str(req.body.program, 300);
  const attempt = str(req.body.attempt, 120);
  const message = str(req.body.message ?? req.body.notes, 3000);
  const productId = str(req.body.productId, 200);
  const subjectMode = str(req.body.subjectMode, 40);
  const subjects = Array.isArray(req.body.selectedSubjects) ? req.body.selectedSubjects.slice(0, 40).map((x: any) => str(x, 120)) : [];

  if (kind === 'newsletter') {
    if (!isEmail(email)) throw bad('Please enter a valid email address.');
  } else {
    if (!name) throw bad('Name is required.');
    if (digitsOf(phone).length < 10) throw bad('Please enter a valid 10-digit phone number.');
  }
  const seq = await nextSeq(null, 'inquiry_seq');
  const id = `INQ-${new Date().getFullYear()}-${String(seq).padStart(4, '0')}`;
  const row = await queryOne(
    `insert into inquiries (id, kind, name, email, phone, program, attempt, subject_mode, selected_subjects, product_id, message)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11) returning *`,
    [id, kind, name || 'Newsletter Subscriber', email, kind === 'newsletter' ? '' : phone, program, attempt, subjectMode || null, JSON.stringify(subjects), productId || null, message || null]
  );
  mailInquiry({ id, kind, name: row.name, email, phone, program, message });
  res.json({ success: true, message: 'We received your details. We will contact you soon.', id });
}));

// ---------------------------------------------------------------
// Public: validate a promo code (does not consume it)
// ---------------------------------------------------------------
publicRouter.post('/discounts/validate', authLimiter, ah(async (req, res) => {
  const code = str(req.body.code, 40).toUpperCase();
  if (!code) return res.json({ success: true, valid: false, discountPercent: 0, message: 'Please enter a promo code.' });
  const c = await queryOne('select * from discount_codes where code = $1', [code]);
  const v = evaluateCode(c, code);
  res.json({ success: true, ...v });
}));

export function evaluateCode(c: any, code: string): { valid: boolean; discountPercent: number; message: string } {
  if (!c) return { valid: false, discountPercent: 0, message: 'Invalid promo code. valid code enter.' };
  if (!c.is_active) return { valid: false, discountPercent: 0, message: `Promo code ${code} is currently inactive.` };
  const limit = c.is_multi_use ? Infinity : Math.max(1, c.usage_limit ?? 1);
  const used = c.usage_count || (c.is_used ? 1 : 0);
  if (used >= limit) return { valid: false, discountPercent: 0, message: `Code ${code} has already been redeemed.` };
  return { valid: true, discountPercent: c.discount_percent, message: `🎉 ${c.discount_percent}% discount lag gaor (${code}).` };
}

publicRouter.get('/health', ah(async (_req, res) => {
  await query('select 1');
  res.json({ status: 'ok', db: 'connected', time: new Date().toISOString() });
}));
