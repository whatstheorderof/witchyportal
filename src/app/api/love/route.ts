import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { sunCompatibility, venusCompatibility, venusOn } from "@/lib/astro/compat";

/** Love sign compatibility from two birth dates (Venus and Sun signs). Nothing is stored. */
const schema = z.object({ a: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), b: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please enter both birth dates." }, { status: 400 });
  for (const d of [parsed.data.a, parsed.data.b]) {
    const y = Number(d.slice(0, 4));
    if (y < 1800 || y > 2100 || new Date(d + "T00:00:00Z").toISOString().slice(0, 10) !== d) return NextResponse.json({ error: "Please enter real birth dates between 1800 and 2100." }, { status: 400 });
  }
  const A = venusOn(parsed.data.a), B = venusOn(parsed.data.b);
  return NextResponse.json({
    a: A, b: B,
    venus: venusCompatibility(A.venus, B.venus),
    sun: sunCompatibility(A.sun, B.sun),
  }, { headers: { "Cache-Control": "no-store" } });
}
