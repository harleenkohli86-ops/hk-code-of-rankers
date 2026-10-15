import nodemailer from 'nodemailer';
import { config } from './config';

/**
 * Transactional email. Provider order:
 *   1) Brevo API (BREVO_API_KEY) — PRIMARY (HTTP, Render-safe)
 *   2) SMTP (SMTP_HOST / SMTP_USER / SMTP_PASS) — fallback, e.g. Gmail App Password (works locally)
 *   3) Resend API (RESEND_API_KEY) — fallback only
 * If none is configured, email is skipped (the request does not fail).
 * Emails are always "fire and forget": an email failure will never cause a booking or payment to fail.
 */

export function mailConfigured(): boolean {
  return Boolean(config.mail.brevoApiKey || config.mail.resendApiKey || (config.mail.smtpHost && config.mail.smtpUser && config.mail.smtpPass));
}

/** Boot-time diagnostics: prints clear, actionable warnings instead of failing silently. */
export function verifyMailSetup(): void {
  const { brevoApiKey, brevoFrom, resendApiKey, resendFrom, smtpHost, smtpUser, smtpPass } = config.mail;
  const smtpReady = Boolean(smtpHost && smtpUser && smtpPass);
  if (!brevoApiKey && !resendApiKey && !smtpReady) {
    console.warn('[mail] Email is NOT configured — set BREVO_API_KEY (+ BREVO_FROM_EMAIL) or SMTP_* in the server environment.');
    return;
  }
  if (brevoApiKey && !brevoFrom) {
    console.warn('[mail] BREVO_API_KEY is set but BREVO_FROM_EMAIL is empty.');
  }
  if (resendApiKey) {
    if (!resendFrom) {
      console.warn('[mail] RESEND_API_KEY is set but RESEND_FROM_EMAIL is empty — Resend rejects every send without a From address. Set RESEND_FROM_EMAIL (e.g. "HK Code of Rankers <noreply@yourdomain.com>").');
    } else if (/onrender\.com/i.test(resendFrom)) {
      console.warn('[mail] RESEND_FROM_EMAIL uses *.onrender.com. That domain shows "Not Started" in Resend and can NEVER be verified (Render owns its DNS, not you). Verify a domain you own in Resend, or configure SMTP_* instead.');
    } else if (/onboarding@resend\.dev/i.test(resendFrom)) {
      console.warn('[mail] Using Resend test sender <onboarding@resend.dev> — emails are only delivered to the Resend account owner address, not to students.');
    }
  }
  if (smtpHost && !smtpReady) console.warn('[mail] SMTP is only partially configured — SMTP_USER and SMTP_PASS are both required.');
}

let smtp: ReturnType<typeof nodemailer.createTransport> | null = null;
function getSmtp() {
  if (!smtp) {
    // NOTE: Render free tier has no stable IPv6 egress — Gmail resolves to IPv6
    // first and connect fails with ENETUNREACH. family:4 forces IPv4.
    // Port 587 + STARTTLS is also far less likely to be blocked than 465.
    const port = config.mail.smtpPort === 465 ? 587 : config.mail.smtpPort;
    smtp = nodemailer.createTransport({
      host: config.mail.smtpHost,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      family: 4,
      auth: { user: config.mail.smtpUser, pass: config.mail.smtpPass },
      // Fail fast instead of hanging: a stuck SMTP socket must not stall requests
      // or accumulate sockets on the server until it runs out of memory.
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 60_000,
    });
  }
  return smtp;
}

export const esc = (v: unknown): string =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

export async function sendMail(opts: { to: string; subject: string; html: string; text?: string }): Promise<boolean> {
  // Top-level guard: an email failure must NEVER reject the promise. An unhandled
  // rejection would crash the whole server process on Node 15+ (Render crash loop).
  try {
    const to = (opts.to || '').trim();
    if (!to || !to.includes('@')) return false;
    const text = opts.text || opts.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    // ---- 1) Brevo API (PRIMARY — HTTP, Render-safe) ----
    if (config.mail.brevoApiKey) {
      try {
        const fromRaw = (config.mail.brevoFrom || 'HK Code of Rankers <abhayprasad.maurya@gmail.com>').trim();
        const mm = fromRaw.match(/^(.*?)<(.+?)>\s*$/);
        const sender = mm
          ? { name: (mm[1] || '').trim() || 'HK Code of Rankers', email: mm[2].trim() }
          : { name: 'HK Code of Rankers', email: fromRaw };
        const r = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'api-key': config.mail.brevoApiKey },
          body: JSON.stringify({ sender, to: [{ email: opts.to }], subject: opts.subject, htmlContent: opts.html, textContent: text }),
        });
        if (r.ok) {
          console.log(`[mail] Brevo accepted for ${mask(opts.to)}`);
          return true;
        }
        const detail = (await r.text()).slice(0, 500);
        console.error(`[mail] Brevo rejected {"status":${r.status},"detail":${JSON.stringify(detail)},"to":${JSON.stringify(mask(opts.to))}}`);
        // fall through to SMTP/Resend fallbacks below
      } catch (err: any) {
        console.error(`[mail] Brevo exception: ${err?.message || err}`);
      }
    }

    // ---- 2) SMTP (fallback — e.g. Gmail App Password; blocked on Render free, works locally) ----
    if (config.mail.smtpHost && config.mail.smtpUser && config.mail.smtpPass) {
      try {
        await getSmtp().sendMail({
          from: config.mail.smtpFrom || `HK Code of Rankers <${config.mail.smtpUser}>`,
          to,
          subject: opts.subject,
          html: opts.html,
          text,
        });
        return true;
      } catch (err: any) {
        console.warn('[mail] SMTP exception:', JSON.stringify({ message: err?.message || String(err), code: err?.code, command: err?.command, response: String(err?.response || '').slice(0, 200) }));
      }
    }

    // ---- 3) Resend API (fallback only — needs verified domain) ----
    if (config.mail.resendApiKey) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${config.mail.resendApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: config.mail.resendFrom, to: [to], subject: opts.subject, html: opts.html, text }),
          // Never let a hung connection stall the request for minutes.
          signal: AbortSignal.timeout(15_000),
        });
        if (res.ok) return true;
        const body = await res.text().catch(() => '');
        let detail = body;
        try {
          const parsed = JSON.parse(body);
          detail = JSON.stringify({ name: parsed?.name, message: parsed?.message, code: parsed?.errorCode });
        } catch {
          detail = body.slice(0, 500);
        }
        console.error('[mail] Resend delivery rejected', JSON.stringify({
          status: res.status,
          detail,
          to: to.replace(/^(.{2}).*(@.*)$/, '$1***$2'),
          sender: config.mail.resendFrom,
          retryAfter: res.headers.get('retry-after') || undefined,
        }));
      } catch (err: any) {
        console.error('[mail] Resend connection exception', JSON.stringify({ message: err?.message || String(err), to: to.replace(/^(.{2}).*(@.*)$/, '$1***$2') }));
      }
    }

    if (!mailConfigured()) console.log(`[mail] (not configured) skipped: "${opts.subject}" -> ${to}`);
    return false;
  } catch (err: any) {
    console.error('[mail] sendMail failed unexpectedly (swallowed to protect the server):', err?.stack || err?.message || err);
    return false;
  }
}

/** Fire-and-forget wrapper. Never throws. */
export function sendMailSafe(opts: { to: string; subject: string; html: string; text?: string }) {
  sendMail(opts).catch((e) => console.warn('[mail] failed:', e?.message || e));
}

function layout(title: string, inner: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f1ea;font-family:Segoe UI,Roboto,Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5dfd3;border-radius:12px;overflow:hidden">
  <div style="background:#0F0F0F;padding:22px;text-align:center;border-bottom:3px solid #C8A45D">
    <div style="color:#FFE3A0;font-size:20px;letter-spacing:1px;font-weight:700">HK CODE OF RANKERS</div>
    <div style="color:#a3a3a3;font-size:12px;margin-top:4px">${esc(title)}</div>
  </div>
  <div style="padding:26px 24px;color:#1f2937;font-size:14px;line-height:1.65">${inner}</div>
  <div style="padding:16px 24px;background:#faf7f0;color:#6b7280;font-size:12px">
    Head Mentor: Harkiran Kaur (AIR 3 CS) &bull; Helpline: +91 92840 84523
  </div>
</div></body></html>`;
}

function rows(pairs: [string, unknown][]): string {
  return `<table style="width:100%;border-collapse:collapse;font-size:13px;margin:14px 0">${pairs
    .filter(([, v]) => v !== undefined && v !== null && String(v) !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 8px;color:#6b7280;width:38%;border-bottom:1px solid #f0ece3">${esc(k)}</td><td style="padding:6px 8px;font-weight:600;border-bottom:1px solid #f0ece3">${esc(v)}</td></tr>`
    )
    .join('')}</table>`;
}

const adminTo = () => config.mail.adminNotificationEmail || 'hk.code.of.rankers@gmail.com';
const base = () => config.appUrl || '';

// ---------------------------------------------------------------
// Event emails
// ---------------------------------------------------------------
export function mailNewRegistration(s: { studentCode: string; fullName: string; email: string; phone: string; program: string; group: string }) {
  sendMailSafe({
    to: s.email,
    subject: 'Welcome to HK Code of Rankers — your Student Portal is ready',
    html: layout('Welcome', `<p>Dear ${esc(s.fullName)},</p><p>Your student account has been created successfully.</p>${rows([
      ['Student ID', s.studentCode],
      ['Program', `${s.program} — ${s.group}`],
    ])}<p>You can log in anytime at <a href="${esc(base())}/student-portal">${esc(base() || 'the website')}/student-portal</a>.</p>`),
  });
  sendMailSafe({
    to: adminTo(),
    subject: `New Student Registration — ${s.fullName}`,
    html: layout('New registration', `<p>A new student registered on the website.</p>${rows([
      ['Student ID', s.studentCode],
      ['Name', s.fullName],
      ['Email', s.email],
      ['Phone', s.phone],
      ['Program', `${s.program} — ${s.group}`],
    ])}<p><a href="${esc(base())}/admin">Open Admin Portal</a></p>`),
  });
}

export function mailPaymentSubmitted(s: { fullName: string; email: string; studentCode: string }, p: { orderId: string; courseName: string; finalAmount: number; utr: string }) {
  sendMailSafe({
    to: adminTo(),
    subject: `UPI payment awaiting approval — ${s.fullName} (₹${p.finalAmount})`,
    html: layout('Payment approval needed', `<p>A student submitted a UPI payment. Please verify the UTR in your bank statement and approve/reject it in the Admin Portal.</p>${rows([
      ['Student', `${s.fullName} (${s.studentCode})`],
      ['Order', p.orderId],
      ['Course', p.courseName],
      ['Amount', `₹${p.finalAmount}`],
      ['UTR', p.utr],
    ])}<p><a href="${esc(base())}/admin">Open Admin Portal</a></p>`),
  });
  sendMailSafe({
    to: s.email,
    subject: `Payment received (pending verification) — ${p.orderId}`,
    html: layout('Payment received', `<p>Dear ${esc(s.fullName)},</p><p>We have received your UTR. Your access is unlocked as soon as the payment is verified (usually within a few hours).</p>${rows([
      ['Order', p.orderId],
      ['Course', p.courseName],
      ['Amount', `₹${p.finalAmount}`],
      ['UTR', p.utr],
    ])}`),
  });
}

export function mailPaymentApproved(s: { fullName: string; email: string }, p: { orderId: string; courseName: string; finalAmount: number }) {
  sendMailSafe({
    to: s.email,
    subject: `Payment approved — ${p.courseName}`,
    html: layout('Payment approved', `<p>Dear ${esc(s.fullName)},</p><p>Your payment has been verified and your course access is now <b>active</b>.</p>${rows([
      ['Order', p.orderId],
      ['Course', p.courseName],
      ['Amount', `₹${p.finalAmount}`],
    ])}<p><a href="${esc(base())}/student-portal">Open Student Portal</a></p>`),
  });
}

export function mailPaymentRejected(s: { fullName: string; email: string }, p: { orderId: string; reason: string }) {
  sendMailSafe({
    to: s.email,
    subject: `Payment could not be verified — ${p.orderId}`,
    html: layout('Payment update', `<p>Dear ${esc(s.fullName)},</p><p>We could not verify your payment.</p>${rows([
      ['Order', p.orderId],
      ['Reason', p.reason],
    ])}<p>Please contact us on WhatsApp (+91 92840 84523) with your payment screenshot.</p>`),
  });
}

export function mailFreeBooking(b: { id: string; name: string; email: string; phone: string; program: string; preferredSlot: string; notes?: string | null }) {
  sendMailSafe({
    to: adminTo(),
    subject: `New FREE 1-on-1 booking — ${b.name}`,
    html: layout('Free session booked', `<p>A new free guidance call was booked from the website.</p>${rows([
      ['Booking ID', b.id],
      ['Name', b.name],
      ['Phone', b.phone],
      ['Email', b.email],
      ['Exam level', b.program],
      ['Preferred slot', b.preferredSlot],
      ['Notes', b.notes],
    ])}<p><a href="${esc(base())}/admin">Open Admin Portal</a></p>`),
  });
  if (b.email) {
    sendMailSafe({
      to: b.email,
      subject: 'Your free 1-on-1 guidance call request is received',
      html: layout('Booking received', `<p>Dear ${esc(b.name)},</p><p>Your free guidance call request has been received. Harkiran Ma'am's team will confirm your slot on WhatsApp shortly.</p>${rows([
        ['Booking ID', b.id],
        ['Preferred slot', b.preferredSlot],
      ])}`),
    });
  }
}

export function mailInquiry(i: { id: string; kind: string; name: string; email: string; phone: string; program: string; message?: string | null }) {
  if (i.kind === 'newsletter') return;
  sendMailSafe({
    to: adminTo(),
    subject: `New inquiry — ${i.name}`,
    html: layout('New inquiry', `${rows([
      ['ID', i.id],
      ['Name', i.name],
      ['Phone', i.phone],
      ['Email', i.email],
      ['Interested in', i.program],
      ['Message', i.message],
    ])}<p><a href="${esc(base())}/admin">Open Admin Portal</a></p>`),
  });
}

export function mailSlotBooking(b: { id: string; studentName: string; email: string; bookingDate: string; bookingTime: string; callType: string }) {
  const html = layout('Mentorship call booked', `<p>Mentorship call booking received.</p>${rows([
    ['Booking ID', b.id],
    ['Student', b.studentName],
    ['Date', b.bookingDate],
    ['Time', b.bookingTime],
    ['Call type', b.callType],
  ])}`);
  sendMailSafe({ to: adminTo(), subject: `Mentorship slot booked — ${b.studentName}`, html });
  if (b.email) sendMailSafe({ to: b.email, subject: 'Your mentorship call slot is booked', html });
}

export async function mailPasswordReset(s: { fullName: string; email: string }, resetUrl: string, minutes: number, firstTime = false): Promise<boolean> {
  if (!config.appUrl) {
    console.error('[mail] Password reset cannot be sent: APP_URL is not configured.');
    return false;
  }
  if (!mailConfigured()) {
    console.error('[mail] Password reset cannot be sent: configure RESEND_API_KEY or SMTP_* on the server.');
    return false;
  }
  const delivered = await sendMail({
    to: s.email,
    subject: firstTime ? 'Set your HK Code of Rankers password' : 'Reset your HK Code of Rankers password',
    html: layout('Password', `<p>Dear ${esc(s.fullName)},</p><p>${
      firstTime ? 'An account was created for you. Click the button below to set your password.' : 'We received a request to reset your password.'
    }</p><p style="text-align:center;margin:24px 0"><a href="${esc(resetUrl)}" style="background:#0F0F0F;color:#FFE3A0;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Set new password</a></p><p style="font-size:12px;word-break:break-all;background:#f7f5f0;padding:12px;border-radius:6px">If the button does not work, open this secure link:<br><a href="${esc(resetUrl)}">${esc(resetUrl)}</a></p><p style="font-size:12px;color:#6b7280">This link works once and expires in ${Math.round(minutes / 60) >= 1 ? Math.round(minutes / 60) + ' hour(s)' : minutes + ' minutes'}. If you did not request this, ignore this email.</p>`),
  });
  if (!delivered) console.error(`[mail] Password reset delivery failed for ${s.email}. Check Resend/SMTP and sender-domain verification.`);
  return delivered;
}
