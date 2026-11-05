import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { buildSynastry } from "@/lib/astro/synastry-request";
import { apiLocale, readingsFor } from "@/i18n/readings";
import { paidReportOrder, reportHash } from "@/lib/report-purchase";
import { emailEnabled, sendEmail } from "@/lib/email";
import { msg } from "@/i18n/config";

const AREA_LABEL = { love: msg("Love"), communication: msg("Communication"), passion: msg("Passion"), stability: msg("Stability"), growth: msg("Growth") } as const;

/**
 * Email a copy of a paid report to the address used at checkout (never to an
 * address typed here, so this can't be used to send email to strangers).
 * The report is generated, sent and forgotten.
 */
export async function POST(req: NextRequest) {
  const rx = await readingsFor(apiLocale(req));
  const t = rx.t;
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: t("Invalid request") }, { status: 400 }); }
  const built = await buildSynastry(body, rx);
  if ("error" in built) return NextResponse.json({ error: t(built.error ?? "") }, { status: 400 });
  const { input, report } = built;
  const order = await paidReportOrder(reportHash(input.a, input.b));
  if (!order) return NextResponse.json({ error: t("This report hasn't been purchased.") }, { status: 403 });
  if (!order.email || !emailEnabled()) return NextResponse.json({ error: t("Email isn't available right now — you can print or save the report as a PDF instead.") }, { status: 409 });
  const last = order.note?.match(/^emailed (\d+)/)?.[1];
  if (last && Date.now() - Number(last) < 10 * 60 * 1000) return NextResponse.json({ error: t("We've just sent it — please check your inbox (and spam folder).") }, { status: 429 });

  const paragraphs = [
    t("Here is your birth chart compatibility report for {a} and {b}. Overall: {score} out of 100.", { a: report.names.a, b: report.names.b, score: report.overall }),
    ...report.scores.map((s) => `${t(AREA_LABEL[s.area])}: ${s.score}/100 — ${s.note}`),
    ...report.aspects.flatMap((a) => [`✦ ${a.heading}`, ...a.paragraphs]),
    ...report.overlays.flatMap((o) => [`✦ ${o.heading}`, ...o.paragraphs]),
    t("With love and magic,\nYulia Moon"),
  ];
  const sent = await sendEmail({ to: order.email, subject: t("Your compatibility report: {a} & {b}", { a: report.names.a, b: report.names.b }), heading: t("Your compatibility report"), paragraphs });
  if (!sent) return NextResponse.json({ error: t("We couldn't send the email just now. Please try again later.") }, { status: 502 });
  await db.update(orders).set({ note: `emailed ${Date.now()}`, updatedAt: new Date() }).where(eq(orders.id, order.id));
  return NextResponse.json({ ok: true, to: order.email.replace(/^(.).*(@.*)$/, "$1…$2") }, { headers: { "Cache-Control": "no-store" } });
}
