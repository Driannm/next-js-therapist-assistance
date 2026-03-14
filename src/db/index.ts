import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Mengambil URL dari file .env
const sql = neon(process.env.DATABASE_URL!);

// Export instance 'db' agar bisa dipanggil di seluruh project (@/db)
export const db = drizzle(sql, { schema });