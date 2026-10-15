// Usage: npm run create-admin -- "admin@email.com" "StrongPassword123" "Admin Name" "9876543210"
// Creates the admin, or resets the password of an existing admin with that email.
import 'dotenv/config';
import crypto from 'crypto';
import { promisify } from 'util';
import pg from 'pg';

const scrypt = promisify(crypto.scrypt);
const [emailArg, passArg, nameArg, phoneArg] = process.argv.slice(2);
const email = (emailArg || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = passArg || process.env.ADMIN_PASSWORD || '';
const name = nameArg || process.env.ADMIN_NAME || 'Harkiran Kaur';
const phone = phoneArg || process.env.ADMIN_PHONE || '';

if (!email || password.length < 8) {
  console.error('Usage: npm run create-admin -- "email" "password(min 8 chars)" ["name"] ["phone"]');
  process.exit(1);
}
let url = (process.env.DATABASE_URL || '').trim();
if (!url) {
  console.error('DATABASE_URL is not set. Add it to .env.');
  process.exit(1);
}
const ssl =
  process.env.DATABASE_SSL === 'true' ||
  (process.env.DATABASE_SSL !== 'false' && (/supabase\.(co|com)/i.test(url) || /sslmode=(require|verify)/i.test(url)));
url = url.replace(/([?&])sslmode=[^&]*&?/i, '$1').replace(/[?&]$/, '');

const salt = crypto.randomBytes(16);
const hash = (await scrypt(password, salt, 64)).toString('hex');
const stored = `scrypt$${salt.toString('hex')}$${hash}`;

const client = new pg.Client({ connectionString: url, ssl: ssl ? { rejectUnauthorized: false } : false });
try {
  await client.connect();
  const { rowCount } = await client.query(
    `update admins set password_hash=$2, name=$3, phone=$4, updated_at=now() where lower(email)=$1`,
    [email, stored, name, phone]
  );
  if (!rowCount) {
    await client.query('insert into admins (name,email,phone,password_hash) values ($1,$2,$3,$4)', [name, email, phone, stored]);
    console.log(`✅ Admin created: ${email}`);
  } else {
    console.log(`✅ Admin password updated: ${email}`);
  }
} catch (e) {
  console.error('❌ Failed:', e.message, '\n(already/previously `npm run db:setup` run.)');
  process.exitCode = 1;
} finally {
  await client.end();
}
