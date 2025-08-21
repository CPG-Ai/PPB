import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';

let pool: pg.Pool | null = null;
let cachedDb: NodePgDatabase | null = null;

export function getDb(): NodePgDatabase {
	if (cachedDb) return cachedDb;
	const url = process.env.DATABASE_URL;
	if (!url) {
		throw new Error('DATABASE_URL is not set');
	}
	if (!pool) {
		pool = new pg.Pool({ connectionString: url });
	}
	cachedDb = drizzle(pool);
	return cachedDb;
}

