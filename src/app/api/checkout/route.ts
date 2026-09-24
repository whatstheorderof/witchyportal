import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { checkoutClicks } from "@/db/schema";
import { getBookingSelection } from "@/lib/queries";
import { deploymentEnv, paymentMode } from "@/lib/env";
import { validatePaymentUrl } from "@/lib/validation";

/**
 * Sends the visitor to the hosted payment page for a booking option.
 * The payment URL is resolved on the server (never taken from the browser)
 * and re-validated against the approved provider list.
 *
 * Logging a checkout click does NOT mean a booking was made.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const optionId = String(form.get("optionId") ?? "");
  const accepted = form.get("accept") === "on";
  const back = (slug: string | null, error: string) =>
    NextResponse.redirect(new URL(slug ? `/retreats/${slug}/book?option=${optionId}&error=${error}` : "/retreats", req.url), 303);

  if (!/^[0-9a-f-]{36}$/i.test(optionId)) return back(null, "unavailable");
  const sel = await getBookingSelection(optionId);
  if (!sel) return back(null, "unavailable");
  const { option, departure, retreat } = sel;
  if (!accepted) return back(retreat.slug, "terms");
  const ok = (a: string) => a === "available" || a === "limited";
  if (!ok(option.availability) || !ok(departure.availability)) return back(retreat.slug, "unavailable");

  const mode = paymentMode();
  const raw = mode === "live" ? option.paymentUrl : option.testPaymentUrl;
  const v = raw ? validatePaymentUrl(raw) : null;
  if (!v || !v.ok) return back(retreat.slug, "nolink");

  try {
    await db.insert(checkoutClicks).values({
      optionId: option.id,
      retreatTitle: retreat.title,
      optionLabel: `${departure.startDate} · ${option.label}`,
      amount: option.amount,
      currency: option.currency,
      environment: `${deploymentEnv()}/${mode}`,
    });
  } catch (e) {
    console.error("checkout click log failed", e);
  }
  return NextResponse.redirect(v.url, 303);
}

export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL("/retreats", req.url));
}
