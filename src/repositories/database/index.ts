import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';

const connectionString = process.env.DATABASE_URL;

// Allow SSL when PGSSLMODE=require (common in hosted Postgres like Vercel/Render)
const ssl =
  process.env.PGSSLMODE === 'require'
    ? {
        rejectUnauthorized: false,
      }
    : undefined;

let pool: Pool | null = null;

const getPool = (): Pool => {
  if (pool) return pool;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Please configure your PostgreSQL connection string.');
  }
  pool = new Pool({
    connectionString,
    ssl,
  });
  return pool;
};

export const db = {
  query: <T = any>(text: string, params?: any[]): Promise<QueryResult<T>> =>
    getPool().query<T>(text, params),
  connect: (): Promise<PoolClient> => getPool().connect(),
};

export const ensureConnection = async (): Promise<void> => {
  await db.query('SELECT 1');
};