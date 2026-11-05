import { NextResponse, type NextRequest } from "next/server";
import { chartFromBody } from "@/lib/astro/birth-request";
import { todayKey } from "@/lib/astro/horoscope";
import { personalDay } from "@/lib/astro/personal";
import { addDays } from "@/lib/astro/sky";
import { apiLocale, readingsFor } from "@/i18n/readings";

/**
 * Today's personal horoscope from a whole birth chart. The visitor's birth
 * details live only in their own browser; they are sent here to calculate the
 * day, used in memory and never stored or logged.
 */
export async function POST(req: NextRequest) {
  const rx = await readingsFor(apiLocale(req));
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: rx.t("Invalid request") }, { status: 400 }); }
  const offset = Number(body.offset ?? 0);
  const r = await chartFromBody({ date: body.date, time: body.time ?? null, placeId: body.placeId });
  if ("error" in r) return NextResponse.json({ error: rx.t(r.error) }, { status: r.status, headers: { "Cache-Control": "no-store" } });
  const day = addDays(todayKey(), Math.max(-1, Math.min(1, Number.isFinite(offset) ? offset : 0)));
  return NextResponse.json({ horoscope: personalDay(r.chart, day, rx) }, { headers: { "Cache-Control": "no-store" } });
}
