// Usage: npm run db:setup
// Applies db/schema.sql to the database in DATABASE_URL (safe to run many times).
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));
let url = (process.env.DATABASE_URL || '').trim();
if (!url) {
  console.error('DATABASE_URL is not set. Add it to .env.');
  process.exit(1);
}
const ssl =
  process.env.DATABASE_SSL === 'true' ||
  (process.env.DATABASE_SSL !== 'false' && (/supabase\.(co|com)/i.test(url) || /sslmode=(require|verify)/i.test(url)));
url = url.replace(/([?&])sslmode=[^&]*&?/i, '$1').replace(/[?&]$/, '');

const client = new pg.Client({ connectionString: url, ssl: ssl ? { rejectUnauthorized: false } : false });
try {
  await client.connect();
  await client.query(fs.readFileSync(path.join(here, '..', 'db', 'schema.sql'), 'utf8'));
  const { rows } = await client.query(
    "select table_name from information_schema.tables where table_schema='public' order by 1"
  );
  console.log('✅ Database schema ready. Tables:', rows.map((r) => r.table_name).join(', '));
} catch (e) {
  console.error('❌ Failed:', e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
