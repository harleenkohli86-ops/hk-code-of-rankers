import crypto from 'crypto';
import { promisify } from 'util';
import type { Request, Response, NextFunction } from 'express';
import { config, isProd } from './config';

const scrypt = promisify(crypto.scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

// ---------------------------------------------------------------
// Password hashing (scrypt, per-user random salt)
// ---------------------------------------------------------------
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

const DUMMY_HASH = 'scrypt$00000000000000000000000000000000$' + '00'.repeat(64);

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  // Always burn the same CPU time so response time does not reveal whether an account exists.
  const target = stored && stored.startsWith('scrypt$') ? stored : DUMMY_HASH;
  const [, saltHex, hashHex] = target.split('$');
  try {
    const computed = await scrypt(password || '', Buffer.from(saltHex, 'hex'), 64);
    const expected = Buffer.from(hashHex, 'hex');
    const ok = computed.length === expected.length && crypto.timingSafeEqual(computed, expected);
    return ok && target === stored;
  } catch {
    return false;
  }
}

/** Short fingerprint of the stored hash: changing the password invalidates old sessions. */
export function fingerprint(stored: string | null | undefined): string {
  return crypto.createHash('sha256').update(stored || 'none').digest('hex').slice(0, 12);
}

// ---------------------------------------------------------------
// Signed session tokens (stateless HMAC, survive server restarts)
// ---------------------------------------------------------------
let secret = config.sessionSecret;
if (!secret) {
  secret = crypto.randomBytes(48).toString('hex');
  if (!isProd) console.warn('[security] SESSION_SECRET is not set — a temporary secret is being used (everyone will be logged out after a restart).');
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString('base64url');
}

export interface SessionPayload {
  r: 'student' | 'admin';
  sub: string;
  pv: string;
  exp: number; // epoch seconds
}

export function signSession(p: Omit<SessionPayload, 'exp'>, ttlSeconds: number): string {
  const payload: SessionPayload = { ...p, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifySession(token: string | undefined, role: 'student' | 'admin'): SessionPayload | null {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (payload.r !== role) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export function sha256(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// ---------------------------------------------------------------
// Cookies
// ---------------------------------------------------------------
export function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie;
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    try {
      out[k] = decodeURIComponent(v);
    } catch {
      out[k] = v;
    }
  }
  return out;
}

export function setSessionCookie(req: Request, res: Response, name: string, value: string, maxAgeSeconds: number) {
  const secure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (secure) parts.push('Secure');
  appendCookie(res, parts.join('; '));
}

export function clearSessionCookie(req: Request, res: Response, name: string) {
  const secure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  appendCookie(res, `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`);
}

function appendCookie(res: Response, cookie: string) {
  const prev = res.getHeader('Set-Cookie');
  if (!prev) res.setHeader('Set-Cookie', cookie);
  else res.setHeader('Set-Cookie', ([] as string[]).concat(prev as any, cookie));
}

export const STUDENT_COOKIE = 'hk_student';
export const ADMIN_COOKIE = 'hk_admin';

// ---------------------------------------------------------------
// Rate limiting (in-memory; fine for a single Node instance)
// ---------------------------------------------------------------
interface Bucket {
  count: number;
  resetAt: number;
  lockedUntil: number;
}

export class RateLimiter {
  private buckets = new Map<string, Bucket>();
  constructor(
    private max: number,
    private windowMs: number,
    private lockMs: number
  ) {
    setInterval(() => {
      const now = Date.now();
      for (const [k, b] of this.buckets) if (b.resetAt < now && b.lockedUntil < now) this.buckets.delete(k);
    }, 10 * 60 * 1000).unref();
  }
  check(key: string): { ok: boolean; retryMinutes?: number } {
    const b = this.buckets.get(key);
    const now = Date.now();
    if (b && b.lockedUntil > now) return { ok: false, retryMinutes: Math.max(1, Math.ceil((b.lockedUntil - now) / 60000)) };
    return { ok: true };
  }
  fail(key: string) {
    const now = Date.now();
    let b = this.buckets.get(key);
    if (!b || b.resetAt < now) b = { count: 0, resetAt: now + this.windowMs, lockedUntil: 0 };
    b.count += 1;
    if (b.count >= this.max) b.lockedUntil = now + this.lockMs;
    this.buckets.set(key, b);
  }
  clear(key: string) {
    this.buckets.delete(key);
  }
}

/** Generic per-IP request limiter for public write endpoints (spam protection). */
export function ipLimiter(maxPerWindow: number, windowMs: number) {
  const hits = new Map<string, { n: number; resetAt: number }>();
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
  }, 5 * 60 * 1000).unref();
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const h = hits.get(ip);
    if (!h || h.resetAt < now) {
      hits.set(ip, { n: 1, resetAt: now + windowMs });
      return next();
    }
    h.n += 1;
    if (h.n > maxPerWindow) {
      return res.status(429).json({ success: false, message: 'Bahut zorda requests. Thodi der after try karein.' });
    }
    next();
  };
}
