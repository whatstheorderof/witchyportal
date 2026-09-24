/**
 * Deployment environment helpers.
 *
 * Payment mode decides which link a booking option sends visitors to:
 *  - "live": the production payment URL
 *  - "test": the test-mode payment URL (previews, local development)
 *
 * Defaults to "live" only on Vercel's production environment. Override with
 * PAYMENT_MODE=live|test.
 */
export type PaymentMode = "live" | "test";

export function paymentMode(): PaymentMode {
  const explicit = process.env.PAYMENT_MODE;
  if (explicit === "live" || explicit === "test") return explicit;
  return process.env.VERCEL_ENV === "production" ? "live" : "test";
}

export function deploymentEnv(): string {
  return process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";
}

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL && process.env.VERCEL_ENV === "production")
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
