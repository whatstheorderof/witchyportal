import { NextResponse, type NextRequest } from "next/server";
import { chartFromBody } from "@/lib/astro/birth-request";
import { calculate } from "@/lib/astro/calc";
import { CALCS, type CalcKind } from "@/lib/astro/calc-meta";
import { apiLocale, readingsFor } from "@/i18n/readings";

/** One calculator result. Birth details are used in memory only and never stored. */
export async function POST(req: NextRequest) {
  const rx = await readingsFor(apiLocale(req));
  const t = rx.t;
  let body: { kind?: string } & Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: t("Invalid request") }, { status: 400 }); }
  const kind = body.kind as CalcKind;
  if (!kind || !(kind in CALCS)) return NextResponse.json({ error: t("Unknown calculator") }, { status: 400 });
  if (CALCS[kind].time === "required" && !body.time) return NextResponse.json({ error: t("This calculator needs your birth time.") }, { status: 400 });
  const r = await chartFromBody(body);
  if ("error" in r) return NextResponse.json({ error: t(r.error) }, { status: r.status, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json({ result: calculate(kind, r.chart, rx) }, { headers: { "Cache-Control": "no-store" } });
}
