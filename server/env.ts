// Must be the FIRST import: finds the project root, loads .env and decides dev/production mode.
import dotenv from 'dotenv';
import path from 'path';

const here = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
/** Project root — works even if the host starts the app from another working directory. */
export const ROOT_DIR = path.basename(here) === 'dist' ? path.join(here, '..') : process.cwd();

dotenv.config({ path: path.join(ROOT_DIR, '.env'), quiet: true });

if (process.argv.includes('--dev')) process.env.NODE_ENV = 'development';
else if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
