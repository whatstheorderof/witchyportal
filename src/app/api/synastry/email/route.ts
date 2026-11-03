import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { buildSynastry } from "@/lib/astro/synastry-request";
import { paidReportOrder, reportHash } from "@/lib/report-purchase";
import { emailEnabled, sendEmail } from "@/lib/email";

/**
 * Email a copy of a paid report to the address used at checkout (never to an
 * address typed here, so this can't be used to send email to strangers).
 * The report is generated, sent and forgotten.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const built = await buildSynastry(body);
  if ("error" in built) return NextResponse.json({ error: built.error }, { status: 400 });
  const { input, report } = built;
  const order = await paidReportOrder(reportHash(input.a, input.b));
  if (!order) return NextResponse.json({ error: "This report hasn't been purchased." }, { status: 403 });
  if (!order.email || !emailEnabled()) return NextResponse.json({ error: "Email isn't available right now — you can print or save the report as a PDF instead." }, { status: 409 });
  const last = order.note?.match(/^emailed (\d+)/)?.[1];
  if (last && Date.now() - Number(last) < 10 * 60 * 1000) return NextResponse.json({ error: "We've just sent it — please check your inbox (and spam folder)." }, { status: 429 });

  const paragraphs = [
    `Here is your birth chart compatibility report for ${report.names.a} and ${report.names.b}. Overall: ${report.overall} out of 100.`,
    ...report.scores.map((s) => `${s.area[0].toUpperCase()}${s.area.slice(1)}: ${s.score}/100 — ${s.note}`),
    ...report.aspects.flatMap((a) => [`✦ ${a.heading}`, ...a.paragraphs]),
    ...report.overlays.flatMap((o) => [`✦ ${o.heading}`, ...o.paragraphs]),
    "With love and magic,\nYulia Moon",
  ];
  const sent = await sendEmail({ to: order.email, subject: `Your compatibility report: ${report.names.a} & ${report.names.b}`, heading: "Your compatibility report", paragraphs });
  if (!sent) return NextResponse.json({ error: "We couldn't send the email just now. Please try again later." }, { status: 502 });
  await db.update(orders).set({ note: `emailed ${Date.now()}`, updatedAt: new Date() }).where(eq(orders.id, order.id));
  return NextResponse.json({ ok: true, to: order.email.replace(/^(.).*(@.*)$/, "$1…$2") }, { headers: { "Cache-Control": "no-store" } });
}
