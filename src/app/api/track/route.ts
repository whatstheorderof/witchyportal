import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";

/**
 * Records anonymous journey events for the admin funnel. Only whitelisted
 * event names and short string properties are kept — never personal data,
 * IP addresses or birth details.
 */
const ALLOWED = new Set(["retreat_view", "option_select", "review_view", "waitlist_view", "watch_start", "tarot_reading"]);
const BOTS = /bot|crawl|spider|slurp|preview|headless|lighthouse/i;

export async function POST(req: NextRequest) {
  if (BOTS.test(req.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });
  try {
    const body = (await req.json()) as { name?: string; path?: string; props?: Record<string, unknown> };
    if (!body.name || !ALLOWED.has(body.name)) return new NextResponse(null, { status: 204 });
    const props: Record<string, string> = {};
    for (const [k, v] of Object.entries(body.props ?? {}).slice(0, 5)) {
      if (/^[a-z_]{1,20}$/.test(k) && typeof v === "string") props[k] = v.slice(0, 80);
    }
    await db.insert(events).values({ name: body.name, path: String(body.path ?? "").slice(0, 200), props });
  } catch {
    /* tracking must never break the site */
  }
  return new NextResponse(null, { status: 204 });
}
