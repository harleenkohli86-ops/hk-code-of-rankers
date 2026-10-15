import { ROOT_DIR } from './server/env';
import { config, isProd, validateConfig } from './server/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { publicRouter } from './server/routes/public';
import { studentRouter } from './server/routes/student';
import { adminRouter } from './server/routes/admin';
import { HttpError } from './server/http';
import { prepareDatabase } from './server/bootstrap';
import { verifyMailSetup } from './server/mailer';

// ---- Process guards: a background failure (e.g. an email hiccup) must never crash the server ----
process.on('unhandledRejection', (reason) => {
  console.error('[process] Unhandled promise rejection (recovered):', reason instanceof Error ? reason.stack || reason.message : reason);
});
process.on('uncaughtException', (err) => {
  console.error('[process] Uncaught exception (recovered):', err?.stack || err);
});

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '5mb' }));

// ---- Security headers ----
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (isProd) res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  next();
});

// ---- CSRF guard: browser-origin writes must come from our own site ----
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.headers.origin;
  if (origin) {
    try {
      const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
      if (new URL(origin).host !== host) {
        return res.status(403).json({ success: false, message: 'Cross-site request blocked.' });
      }
    } catch {
      return res.status(403).json({ success: false, message: 'Invalid origin.' });
    }
  }
  next();
});

// API responses must never be cached
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use('/api/admin', adminRouter);
app.use('/api/student', studentRouter);
app.use('/api', publicRouter);
app.use('/api', (_req, res) => res.status(404).json({ success: false, message: 'API route not found.' }));

// ---- Error handler ----
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ success: false, message: err.message, ...(err.extra || {}) });
  }
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ success: false, message: 'Invalid JSON.' });
  if (err?.type === 'entity.too.large') return res.status(413).json({ success: false, message: 'The submitted data is too large.' });
  if (err?.code === '23505') return res.status(409).json({ success: false, message: 'This record already exists (duplicate).' });
  console.error('[server error]', err);
  res.status(500).json({ success: false, message: 'Something went wrong on the server. Please try again later.' });
});

async function start() {
  const problems = validateConfig();
  if (problems.length) {
    console.error('\n❌ The server cannot start:\n' + problems.map((p) => '  - ' + p).join('\n') + '\n');
    process.exit(1);
  }

  try {
    await prepareDatabase();
  } catch (err: any) {
    console.error('\n❌ Could not connect to or set up the database:', err?.message || err);
    console.error('   DATABASE_URL check karein (Supabase: Project Settings -> Database -> Connection string -> Session pooler).\n');
    process.exit(1);
  }

  const clientDir = path.join(ROOT_DIR, 'dist', 'client');
  if (isProd) {
    if (!fs.existsSync(path.join(clientDir, 'index.html'))) {
      console.error('❌ dist/client/index.html was not found. Run `npm run build` first.');
      process.exit(1);
    }
    app.use('/assets', express.static(path.join(clientDir, 'assets'), { maxAge: '1y', immutable: true }));
    app.use(express.static(clientDir, { index: false, maxAge: '1h' }));
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(clientDir, 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`\n✅ HK Code of Rankers running on port ${config.port} (${isProd ? 'production' : 'development'})`);
    const smtpReady = Boolean(config.mail.smtpHost && config.mail.smtpUser && config.mail.smtpPass);
    console.log(`   Database: connected | Email provider: ${smtpReady ? 'SMTP (primary)' : ''}${smtpReady && config.mail.resendApiKey ? ' + Resend (fallback)' : !smtpReady && config.mail.resendApiKey ? 'Resend' : !smtpReady ? 'NOT configured' : ''}`);
    if (smtpReady) console.log(`   SMTP sender: ${config.mail.smtpFrom || config.mail.smtpUser}\n`);
    if (!smtpReady && config.mail.resendApiKey) console.log(`   Resend sender: ${config.mail.resendFrom || '(not configured)'}\n`);
    verifyMailSetup();
  });
}

start();
