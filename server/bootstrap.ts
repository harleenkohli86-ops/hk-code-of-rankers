import { config } from './config';
import { queryOne, query, applySchema } from './db';
import { hashPassword } from './security';

/** Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD if the admins table is empty. */
export async function ensureAdmin(): Promise<void> {
  const row = await queryOne('select count(*)::int as n from admins');
  if ((row?.n || 0) > 0) return;
  const { email, password, name, phone } = config.admin;
  if (!email || !password) {
    console.warn('\n[!] No admin account exists. set ADMIN_EMAIL and ADMIN_PASSWORD in .env and restart the server\n    or `npm run create-admin` run.\n');
    return;
  }
  if (password.length < 8) {
    console.warn('[!] ADMIN_PASSWORD must be at least 8 characters long. The admin was not created.');
    return;
  }
  await query('insert into admins (name, email, phone, password_hash) values ($1,$2,$3,$4)', [name, email, phone, await hashPassword(password)]);
  console.log(`[bootstrap] Admin account bana dior gaor: ${email}`);
}

export async function prepareDatabase(): Promise<void> {
  if (config.autoMigrate) await applySchema();
  await ensureAdmin();
}
