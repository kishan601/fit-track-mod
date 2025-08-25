import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";

// Use DATABASE_URL from environment or fallback (for local development)
const DATABASE_URL =
  process.env.DATABASE_URL?.trim() ||
  "postgresql://neondb_owner:npg_gMJK9kRn3beI@ep-wild-sea-a6vild0u.us-west-2.aws.neon.tech/neondb?sslmode=require";

// Create a connection pool with safe defaults
export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,                  // max concurrent connections
  idleTimeoutMillis: 30000, // close idle connections after 30s
  connectionTimeoutMillis: 20000, // wait max 20s for a connection
});

// Create Drizzle ORM instance
export const db = drizzle(pool, { schema });

console.log(`✅ Connected to database: ${DATABASE_URL}`);
