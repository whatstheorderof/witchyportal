import { NextResponse, type NextRequest } from "next/server";
import { SYNASTRY_PRICE } from "@/lib/astro/compat";
import { buildSynastry } from "@/lib/astro/synastry-request";
import { apiLocale, readingsFor } from "@/i18n/readings";
import { getAdmin } from "@/lib/auth";
import { paidReportOrder, reportHash, reportSalesOn } from "@/lib/report-purchase";
import { confirmWithStripe } from "@/lib/orders";
import { stripeEnabled } from "@/lib/stripe";

/**
 * Birth chart compatibility (synastry). Everyone gets the free preview: the
 * scores, both people's key signs and the three strongest connections. The
 * full report is a paid product (Stripe Checkout, see /api/synastry/checkout):
 * it unlocks when a paid order matches these birth details, and signed-in
 * admins always see it in full (for checking the report).
 * Birth details are used in memory only and never stored.
 */
export async function POST(req: NextRequest) {
  const rx = await readingsFor(apiLocale(req));
  const t = rx.t;
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: t("Invalid request") }, { status: 400 }); }
  const built = await buildSynastry(body, rx);
  if ("error" in built) return NextResponse.json({ error: t(built.error ?? "") }, { status: 400 });
  const { input, report } = built;

  const hash = reportHash(input.a, input.b);
  // Back from Stripe: check the payment with Stripe itself (the redirect proves nothing)
  if (input.session && stripeEnabled()) await confirmWithStripe(input.session);
  const purchased = Boolean(await paidReportOrder(hash));
  const admin = Boolean(await getAdmin());
  const unlocked = purchased || admin;

  const preview = {
    names: report.names, scores: report.scores, overall: report.overall, bigThree: report.bigThree, notes: report.notes,
    highlights: report.aspects.slice(0, 3),
    locked: { aspects: report.aspects.slice(3).map((a) => ({ heading: a.heading, type: a.type })), overlays: report.overlays.length },
  };
  return NextResponse.json(
    { preview, full: unlocked ? report : null, price: SYNASTRY_PRICE, purchasing: reportSalesOn(), purchased, adminPreview: admin && !purchased },
    { headers: { "Cache-Control": "no-store" } },
  );
}
