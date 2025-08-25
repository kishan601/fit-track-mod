import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from "@shared/schema";

// Use environment variable if available, otherwise fallback to public DB URL
const DATABASE_URL =
  process.env.DATABASE_URL?.trim() || 
  "postgresql://neondb_owner:npg_gMJK9kRn3beI@ep-wild-sea-a6vild0u.us-west-2.aws.neon.tech/neondb?sslmode=require";

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });

console.log(`✅ Connected to database: ${DATABASE_URL}`);
