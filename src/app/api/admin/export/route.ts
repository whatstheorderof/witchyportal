import { NextResponse, type NextRequest } from "next/server";
import { desc, isNull } from "drizzle-orm";
import { db } from "@/db";
import * as s from "@/db/schema";
import { getAdmin } from "@/lib/auth";

const csv = (rows: (string | null | Date)[][]) =>
  rows.map((r) => r.map((v) => {
    const t = v instanceof Date ? v.toISOString() : (v ?? "");
    // Neutralise spreadsheet formula injection
    const safe = /^[=+\-@\t\r]/.test(t) ? `'${t}` : t;
    return `"${safe.replace(/"/g, '""')}"`;
  }).join(",")).join("\r\n");

export async function GET(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const type = req.nextUrl.searchParams.get("type");
  let body = "";
  if (type === "subscribers") {
    const rows = await db.select().from(s.subscribers).where(isNull(s.subscribers.unsubscribedAt)).orderBy(desc(s.subscribers.createdAt));
    body = csv([["email", "source", "consent_at"], ...rows.map((r) => [r.email, r.source, r.consentAt])]);
  } else if (type === "waitlist") {
    const rows = await db.select().from(s.waitlist).orderBy(desc(s.waitlist.createdAt));
    body = csv([["name", "email", "retreat_id", "departure_id", "note", "status", "created_at"], ...rows.map((r) => [r.name, r.email, r.retreatId, r.departureId, r.note, r.status, r.createdAt])]);
  } else {
    const rows = await db.select().from(s.enquiries).orderBy(desc(s.enquiries.createdAt));
    body = csv([["name", "email", "topic", "retreat_id", "message", "status", "created_at"], ...rows.map((r) => [r.name, r.email, r.topic, r.retreatId, r.message, r.status, r.createdAt])]);
  }
  return new NextResponse("﻿" + body, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="witchy-portal-${type ?? "enquiries"}.csv"`, "Cache-Control": "no-store" },
  });
}
