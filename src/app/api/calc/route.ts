import { NextResponse, type NextRequest } from "next/server";
import { chartFromBody } from "@/lib/astro/birth-request";
import { calculate } from "@/lib/astro/calc";
import { CALCS, type CalcKind } from "@/lib/astro/calc-meta";

/** One calculator result. Birth details are used in memory only and never stored. */
export async function POST(req: NextRequest) {
  let body: { kind?: string } & Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const kind = body.kind as CalcKind;
  if (!kind || !(kind in CALCS)) return NextResponse.json({ error: "Unknown calculator" }, { status: 400 });
  if (CALCS[kind].time === "required" && !body.time) return NextResponse.json({ error: "This calculator needs your birth time." }, { status: 400 });
  const r = await chartFromBody(body);
  if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json({ result: calculate(kind, r.chart) }, { headers: { "Cache-Control": "no-store" } });
}
