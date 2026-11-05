import { NextResponse, type NextRequest } from "next/server";
import { SYNASTRY_PRICE } from "@/lib/astro/compat";
import { buildSynastry } from "@/lib/astro/synastry-request";
import { apiLocale, readingsFor } from "@/i18n/readings";
import { paidReportOrder, reportHash, reportSalesOn } from "@/lib/report-purchase";
import { startReportCheckout } from "@/lib/orders";
import { localePath } from "@/i18n/config";

/** Start paying for the full compatibility report. Only an HMAC of the birth details is stored. */
export async function POST(req: NextRequest) {
  const rx = await readingsFor(apiLocale(req));
  const t = rx.t;
  if (!reportSalesOn()) return NextResponse.json({ error: t("The full report isn't on sale yet.") }, { status: 409 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: t("Invalid request") }, { status: 400 }); }
  const built = await buildSynastry(body, rx);
  if ("error" in built) return NextResponse.json({ error: t(built.error ?? "") }, { status: 400 });
  const { input, report } = built;
  const hash = reportHash(input.a, input.b);
  if (await paidReportOrder(hash)) return NextResponse.json({ alreadyPaid: true }, { headers: { "Cache-Control": "no-store" } });
  const r = await startReportCheckout({
    inputHash: hash, amount: SYNASTRY_PRICE.amount, currency: SYNASTRY_PRICE.currency,
    title: t("Birth chart compatibility report: {a} & {b}", { a: report.names.a, b: report.names.b }), returnPath: localePath(rx.locale, "/compatibility/birth-chart"),
  });
  if ("error" in r) return NextResponse.json({ error: t("We couldn't open the payment page just now. Nothing has been charged — please try again.") }, { status: 502 });
  return NextResponse.json({ url: r.url }, { headers: { "Cache-Control": "no-store" } });
}
