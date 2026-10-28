import { NextResponse, type NextRequest } from "next/server";
import { dailyHoroscope, signFromSlug, todayKey } from "@/lib/astro/horoscope";
import { addDays } from "@/lib/astro/sky";

/** Today's horoscope for one sign (used by the "your day" card and splash). */
export async function GET(req: NextRequest) {
  const sign = signFromSlug(req.nextUrl.searchParams.get("sign") ?? "");
  if (!sign) return NextResponse.json({ error: "Unknown sign" }, { status: 400 });
  const offset = Number(req.nextUrl.searchParams.get("offset") ?? 0);
  const day = addDays(todayKey(), Math.max(-1, Math.min(1, Number.isFinite(offset) ? offset : 0)));
  return NextResponse.json({ horoscope: dailyHoroscope(sign, day) }, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } });
}
