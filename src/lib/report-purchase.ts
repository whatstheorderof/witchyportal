import "server-only";
import { createHmac } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { stripeEnabled } from "./stripe";

/**
 * The paid compatibility report. We never store the two people's birth
 * details: a purchase is remembered as an HMAC of them (a one-way code), so
 * entering the same details again — on the same device, where the browser
 * keeps them — unlocks the report. Names don't count, and the order of the
 * two people doesn't matter.
 */
export type ReportPerson = { date: string; time: string | null; placeId: number };

export const reportSalesOn = () => stripeEnabled() && process.env.SYNASTRY_SALES?.trim().toLowerCase() !== "off";

function secret() {
  const s = process.env.REPORT_SECRET?.trim() || process.env.AUTH_SECRET?.trim();
  if (!s || s.length < 32) throw new Error("REPORT_SECRET (or AUTH_SECRET) must be at least 32 characters");
  return s;
}

export function reportHash(a: ReportPerson, b: ReportPerson) {
  const one = (p: ReportPerson) => `${p.date}|${p.time ?? "-"}|${p.placeId}`;
  const pair = [one(a), one(b)].sort().join("&");
  return createHmac("sha256", secret()).update(`synastry:v1:${pair}`).digest("hex");
}

export async function paidReportOrder(hash: string) {
  const [o] = await db.select().from(orders).where(and(eq(orders.kind, "synastry"), eq(orders.inputHash, hash), eq(orders.status, "paid"))).limit(1);
  return o ?? null;
}
