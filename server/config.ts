import './env';

const env = process.env;

export const isProd = env.NODE_ENV === 'production';

export const config = {
  port: Number(env.PORT) || 3000,
  databaseUrl: (env.DATABASE_URL || '').trim(),
  databaseSsl: (env.DATABASE_SSL || '').trim().toLowerCase(), // 'true' | 'false' | '' (auto)
  autoMigrate: (env.AUTO_MIGRATE || 'true').toLowerCase() !== 'false',
  sessionSecret: (env.SESSION_SECRET || '').trim(),
  appUrl: ((env.APP_URL || '').trim() || (isProd ? '' : `http://localhost:${Number(env.PORT) || 3000}`)).replace(/\/+$/, ''),

  admin: {
    name: (env.ADMIN_NAME || 'Harkiran Kaur').trim(),
    email: (env.ADMIN_EMAIL || '').trim().toLowerCase(),
    phone: (env.ADMIN_PHONE || '').trim(),
    password: env.ADMIN_PASSWORD || '',
  },

  mail: {
    adminNotificationEmail: (env.ADMIN_NOTIFICATION_EMAIL || '').trim(),
    brevoApiKey: (env.BREVO_API_KEY || '').trim(),
    brevoFrom: (env.BREVO_FROM_EMAIL || '').trim(),
    resendApiKey: (env.RESEND_API_KEY || '').trim(),
    // Do not silently use a non-production sender in production. A send-only Resend
    // key is valid, but onboarding@resend.dev can only deliver to the Resend owner.
    resendFrom: (env.RESEND_FROM_EMAIL || (isProd ? '' : 'HK Code of Rankers <onboarding@resend.dev>')).trim(),
    smtpHost: (env.SMTP_HOST || '').trim(),
    smtpPort: Number(env.SMTP_PORT) || 587,
    smtpUser: (env.SMTP_USER || '').trim(),
    // Gmail App Passwords are shown as "xxxx xxxx xxxx xxxx" — spaces must be stripped.
    smtpPass: (env.SMTP_PASS || '').replace(/\s+/g, ''),
    smtpFrom: (env.SMTP_FROM || '').trim(),
  },
};

/** Fatal config problems are reported clearly instead of a cryptic crash. */
export function validateConfig(): string[] {
  const problems: string[] = [];
  if (!config.databaseUrl) {
    problems.push('DATABASE_URL is not set. Add it to .env or the hosting environment variables.');
  }
  if (isProd && config.sessionSecret.length < 32) {
    problems.push('SESSION_SECRET must be at least 32 characters long (required in production).');
  }
  if (isProd && !config.appUrl) {
    problems.push('APP_URL is not set (for example, https://yourdomain.com) — it is required for password-reset email links.');
  }
  // Email configuration must not prevent the website from booting. The mailer
  // safely skips/reports delivery failures, and a verified sender can be added
  // later without another code deployment.
  return problems;
}
