/**
 * Creates the first admin account during a Vercel build, from the
 * ADMIN_EMAIL and ADMIN_PASSWORD environment variables — so nobody has to
 * run a terminal command. It only acts when the database has NO admin yet;
 * once an admin exists it does nothing (and you can delete ADMIN_PASSWORD
 * from Vercel). Use `npm run admin:create` later to add or reset admins.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import { adminUsers } from "../src/db/schema";
import { hashPassword } from "../src/lib/password";

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!url) return;
  const client = postgres(url, { max: 1, onnotice: () => {} });
  const db = drizzle(client);
  try {
    const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(adminUsers);
    if (n > 0) {
      console.log("✓ Admin account exists");
      if (password) console.log("  (You can now delete ADMIN_PASSWORD from the Vercel environment variables.)");
      return;
    }
    if (!email || !email.includes("@") || password.length < 12) {
      console.warn("⚠ No admin account yet. Add ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) in Vercel → Settings → Environment Variables, then redeploy.");
      return;
    }
    await db.insert(adminUsers).values({ email, name: process.env.ADMIN_NAME ?? "", passwordHash: await hashPassword(password) });
    console.log(`✓ Admin account created for ${email}`);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  // Never block a deployment over this step.
  console.warn("⚠ Admin bootstrap skipped:", e instanceof Error ? e.message : e);
});
