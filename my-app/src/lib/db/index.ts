import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// IMPORTANT: This is a placeholder. In a real app, you'd get the connection string
// from process.env.DATABASE_URL and handle potential errors.
// Also, you might want to manage the Pool connection more carefully in a serverless environment.
let pool: Pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  // Fallback for environments where DATABASE_URL might not be set during build/dev
  // This will likely fail at runtime if no valid connection string is provided.
  // Consider throwing an error here or using a mock/local DB for development.
  console.warn("DATABASE_URL is not set. Database operations will likely fail.");
  pool = new Pool({}); // This will use default PG environment variables if available
}


export const db = drizzle(pool, { schema });
