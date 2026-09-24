import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. See .env.example and docs/SETUP.md.",
    );
  }
  return postgres(url, {
    // Serverless-friendly: small pool, works with Neon's pooled endpoint.
    max: process.env.NODE_ENV === "production" ? 3 : 5,
    prepare: false,
    idle_timeout: 20,
  });
}

const sql = globalForDb.sql ?? createClient();
if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;

export const db = drizzle(sql, { schema });
export { schema };
