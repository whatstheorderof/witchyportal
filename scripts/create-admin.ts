/**
 * Create or reset an admin user.
 *
 *   npm run admin:create -- you@example.com "a long passphrase" "Yulia"
 *
 * or set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in the environment.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { adminUsers } from "../src/db/schema";
import { hashPassword } from "../src/lib/password";

async function main() {
  const [emailArg, passwordArg, nameArg] = process.argv.slice(2);
  const email = (emailArg ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = passwordArg ?? process.env.ADMIN_PASSWORD ?? "";
  const name = nameArg ?? process.env.ADMIN_NAME ?? "";
  if (!email || !email.includes("@")) throw new Error("Provide an email address");
  if (password.length < 12) throw new Error("Password must be at least 12 characters");
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql);
  const passwordHash = await hashPassword(password);
  await db
    .insert(adminUsers)
    .values({ email, name, passwordHash })
    .onConflictDoUpdate({ target: adminUsers.email, set: { passwordHash, name } });
  console.log(`✓ Admin ready: ${email}`);
  await sql.end();
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
