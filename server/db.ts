import fs from 'fs';
import path from 'path';
import { Pool, PoolClient, QueryResultRow, types } from 'pg';
import { config } from './config';
import { ROOT_DIR } from './env';

// numeric -> number, bigint -> number (safe for our value ranges)
types.setTypeParser(1700, (v) => parseFloat(v));
types.setTypeParser(20, (v) => parseInt(v, 10));

let pool: Pool | null = null;

function buildPool(): Pool {
  let url = config.databaseUrl;
  const wantsSsl =
    config.databaseSsl === 'true' ||
    (config.databaseSsl !== 'false' && (/supabase\.(co|com)/i.test(url) || /sslmode=(require|verify)/i.test(url)));
  url = url.replace(/([?&])sslmode=[^&]*&?/i, '$1').replace(/[?&]$/, '');
  return new Pool({
    connectionString: url,
    ssl: wantsSsl ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 15_000,
  });
}

export function getPool(): Pool {
  if (!pool) pool = buildPool();
  return pool;
}

export async function query<T extends QueryResultRow = any>(text: string, params: any[] = []): Promise<T[]> {
  const res = await getPool().query<T>(text, params);
  return res.rows;
}

export async function queryOne<T extends QueryResultRow = any>(text: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export async function tx<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const out = await fn(client);
    await client.query('COMMIT');
    return out;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      /* ignore */
    }
    throw err;
  } finally {
    client.release();
  }
}

/** Applies db/schema.sql (idempotent) so the app works on a brand-new database. */
export async function applySchema(): Promise<void> {
  const candidates = [path.join(ROOT_DIR, 'db', 'schema.sql'), path.join(process.cwd(), 'db', 'schema.sql')];
  const file = candidates.find((p) => fs.existsSync(p));
  if (!file) throw new Error('db/schema.sql was not found. db/schema.sql must exist inside the project folder.');
  await getPool().query(fs.readFileSync(file, 'utf8'));
}

export async function pingDb(): Promise<boolean> {
  try {
    await getPool().query('select 1');
    return true;
  } catch {
    return false;
  }
}

export async function nextSeq(client: { query: Pool['query'] } | null, name: string): Promise<number> {
  const runner = client || getPool();
  const res: any = await runner.query(`select nextval('${name}') as n`);
  return Number(res.rows[0].n);
}
