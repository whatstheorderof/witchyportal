import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./session";

export async function getAdmin() {
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const [user] = await db
    .select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name })
    .from(adminUsers)
    .where(eq(adminUsers.id, session.sub))
    .limit(1);
  return user ?? null;
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

export async function startSession(user: { id: string; email: string }) {
  const token = await signSession({ sub: user.id, email: user.email });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
