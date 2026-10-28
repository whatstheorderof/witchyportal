import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getPlace } from "@/lib/astro/places";
import { getChartProvider } from "@/lib/astro/provider";
import { synastry, SYNASTRY_PRICE } from "@/lib/astro/compat";
import { getAdmin } from "@/lib/auth";

/**
 * Birth chart compatibility (synastry). Everyone gets the free preview: the
 * scores, both people's key signs and the three strongest connections. The
 * full report is a paid product — payment isn't switched on yet, so for now
 * only a signed-in admin sees it in full (for checking the report).
 * Birth details are used in memory only and never stored.
 */
const person = z.object({
  name: z.string().trim().max(40).optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable(),
  placeId: z.number().int().positive(),
});
const schema = z.object({ a: person, b: person });

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check both people's birth dates, times and places." }, { status: 400 });

  const charts = [];
  for (const p of [parsed.data.a, parsed.data.b]) {
    const year = Number(p.date.slice(0, 4));
    const d = new Date(p.date + "T00:00:00Z");
    if (year < 1800 || year > 2100 || Number.isNaN(+d) || d.toISOString().slice(0, 10) !== p.date) return NextResponse.json({ error: "Please enter real birth dates between 1800 and 2100." }, { status: 400 });
    const place = await getPlace(p.placeId);
    if (!place) return NextResponse.json({ error: "Please choose both birthplaces from the list." }, { status: 400 });
    charts.push(await getChartProvider().calculate({ date: p.date, time: p.time, latitude: place.latitude, longitude: place.longitude, timeZone: place.timeZone, placeLabel: place.label }));
  }
  const nameA = parsed.data.a.name || "Person one";
  const nameB = parsed.data.b.name || "Person two";
  const report = synastry(charts[0], charts[1], nameA, nameB);
  const unlocked = Boolean(await getAdmin());

  const preview = {
    names: report.names, scores: report.scores, overall: report.overall, bigThree: report.bigThree, notes: report.notes,
    highlights: report.aspects.slice(0, 3),
    locked: { aspects: report.aspects.slice(3).map((a) => ({ heading: a.heading, type: a.type })), overlays: report.overlays.length },
  };
  return NextResponse.json(
    { preview, full: unlocked ? report : null, price: SYNASTRY_PRICE, purchasing: false, adminPreview: unlocked },
    { headers: { "Cache-Control": "no-store" } },
  );
}
