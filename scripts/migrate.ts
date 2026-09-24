/**
 * Applies pending SQL migrations from ./drizzle. Runs automatically before
 * every Vercel build (see "vercel-build" in package.json), so each
 * environment's database is always up to date with its code.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    console.warn("⚠ DATABASE_URL not set — skipping migrations.");
    return;
  }
  const sql = postgres(url, { max: 1, onnotice: () => {} });
  await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
  await sql.end();
  console.log("✓ Database migrations applied");
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
