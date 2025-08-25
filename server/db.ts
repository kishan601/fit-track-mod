import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from "@shared/schema";

// Use environment variable if available, otherwise fallback to public DB URL
const DATABASE_URL =
  process.env.DATABASE_URL?.trim() || 
  "postgresql://postgres:dpZdzaxkoyTdwGUhQoezBASqAVSVUfzv@crossover.proxy.rlwy.net:43027/railway";

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });

console.log(`✅ Connected to database: ${DATABASE_URL}`);
