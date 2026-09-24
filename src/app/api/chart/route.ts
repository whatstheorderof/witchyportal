import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getPlace } from "@/lib/astro/places";
import { getChartProvider } from "@/lib/astro/provider";

/**
 * Calculates a chart. Birth details are used in memory only — they are not
 * logged or stored. Place coordinates and time zone are resolved on the server
 * from our place index rather than trusted from the browser.
 */
const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable(),
  placeId: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check your birth date, time and place." }, { status: 400 });
  const { date, time, placeId } = parsed.data;
  const year = Number(date.slice(0, 4));
  if (year < 1800 || year > 2100) return NextResponse.json({ error: "Please enter a birth year between 1800 and 2100." }, { status: 400 });
  const d = new Date(date + "T00:00:00Z");
  if (Number.isNaN(+d) || d.toISOString().slice(0, 10) !== date) return NextResponse.json({ error: "That date doesn't exist." }, { status: 400 });

  const place = await getPlace(placeId);
  if (!place) return NextResponse.json({ error: "We couldn't find that birthplace. Please choose it from the list." }, { status: 400 });

  try {
    const chart = await getChartProvider().calculate({
      date, time, latitude: place.latitude, longitude: place.longitude, timeZone: place.timeZone, placeLabel: place.label,
    });
    return NextResponse.json({ chart }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("chart calculation failed", e instanceof Error ? e.message : "unknown");
    return NextResponse.json({ error: "We couldn't calculate this chart right now. Please try again later." }, { status: 502 });
  }
}
