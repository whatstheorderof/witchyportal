import "server-only";
import Stripe from "stripe";
import { paymentMode, siteUrl } from "./env";

/**
 * Stripe, switched on by environment variables (Vercel → Settings →
 * Environment Variables). Use TEST keys for Preview/Development and LIVE keys
 * for Production:
 *   STRIPE_SECRET_KEY       sk_test_… / sk_live_… (or a restricted key rk_…)
 *   STRIPE_WEBHOOK_SECRET   whsec_… from the webhook endpoint for that mode
 *   REPORT_SECRET           optional, 32+ random characters; signs report
 *                           purchases (falls back to AUTH_SECRET)
 * Without STRIPE_SECRET_KEY nothing changes: retreats keep their payment
 * links and the compatibility report stays a free preview.
 */

const key = () => process.env.STRIPE_SECRET_KEY?.trim() || "";
const keyMode = (k: string) => (/^(sk|rk)_live_/.test(k) ? "live" : /^(sk|rk)_test_/.test(k) ? "test" : null);

/** Why Stripe is off, or null when it is ready to take payments. */
export function stripeProblem(): string | null {
  const k = key();
  if (!k) return "STRIPE_SECRET_KEY is not set";
  const m = keyMode(k);
  if (!m) return "STRIPE_SECRET_KEY doesn't look like a Stripe secret key";
  // Never take real money on a preview or local site.
  if (m === "live" && paymentMode() === "test") return "A LIVE Stripe key is set on a test/preview deployment — use a test key here";
  if (!process.env.STRIPE_WEBHOOK_SECRET?.trim()) return "STRIPE_WEBHOOK_SECRET is not set";
  return null;
}

export const stripeEnabled = () => stripeProblem() === null;
/** "live" or "test", from the key itself */
export const stripeMode = () => keyMode(key()) ?? "test";

let client: Stripe | null = null;
export function stripe(): Stripe {
  if (!stripeEnabled()) throw new Error(`Stripe is not configured: ${stripeProblem()}`);
  client ??= new Stripe(key(), { appInfo: { name: "Witchy Portal", url: "https://witchyportal.org" }, maxNetworkRetries: 2, timeout: 15000 });
  return client;
}

/** For tests: swap in a fake client */
export function __setStripeForTests(fake: Stripe | null) { client = fake; }

export const webhookSecret = () => process.env.STRIPE_WEBHOOK_SECRET?.trim() || "";
export const absolute = (path: string) => `${siteUrl()}${path}`;

/** Stripe needs amounts in the smallest unit; ours already are (pence/cents). Currency lower-case. */
export const stripeCurrency = (c: string) => c.toLowerCase();
