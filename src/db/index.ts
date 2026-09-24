import "server-only";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { sql?: postgres.Sql; db?: Db };

/**
 * The connection is opened lazily on first query, so `next build` (which
 * imports every route) works even when DATABASE_URL isn't available.
 */
function getDb(): Db {
  if (globalForDb.db) return globalForDb.db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. See .env.example and docs/SETUP.md.");
  }
  const sql = postgres(url, {
    // Serverless-friendly: small pool, works with Neon's pooled endpoint.
    max: process.env.NODE_ENV === "production" ? 3 : 5,
    prepare: false,
    idle_timeout: 20,
  });
  const db = drizzle(sql, { schema });
  globalForDb.sql = sql;
  globalForDb.db = db;
  return db;
}

export const db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
