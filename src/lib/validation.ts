import { z } from "zod";

/**
 * Hosts accepted for hosted payment links. Extend with PAYMENT_ALLOWED_HOSTS
 * (comma-separated) — e.g. "pay.example-provider.com".
 */
const DEFAULT_PAYMENT_HOSTS = [
  "buy.stripe.com",
  "checkout.stripe.com",
  "donate.stripe.com",
  "www.paypal.com",
  "paypal.com",
  "paypal.me",
  "www.paypal.me",
  "checkout.revolut.com",
  "revolut.me",
  "pay.revolut.com",
  "wise.com",
  "pay.sumup.com",
  "square.link",
  "checkout.square.site",
  "pay.gocardless.com",
  "buy.tito.io",
  "checkout.shopify.com",
  "app.acuityscheduling.com",
  "checkout.lemonsqueezy.com",
];

export function allowedPaymentHosts(): string[] {
  const extra = (process.env.PAYMENT_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  return [...DEFAULT_PAYMENT_HOSTS, ...extra];
}

export function validatePaymentUrl(raw: string): { ok: true; url: string } | { ok: false; error: string } {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return { ok: false, error: "Enter a full link starting with https://" };
  }
  if (u.protocol !== "https:") return { ok: false, error: "Payment links must use https://" };
  if (u.username || u.password) return { ok: false, error: "Payment links must not contain credentials" };
  const host = u.hostname.toLowerCase();
  const hosts = allowedPaymentHosts();
  const ok = hosts.some((h) => host === h || host.endsWith("." + h.replace(/^www\./, "")));
  if (!ok) {
    return {
      ok: false,
      error: `${host} is not an approved payment provider. Ask your developer to add it to PAYMENT_ALLOWED_HOSTS.`,
    };
  }
  return { ok: true, url: u.toString() };
}

/** Extracts an 11-char YouTube id from any common URL shape (watch, youtu.be, shorts, embed, live). */
export function parseYouTubeId(raw: string): string | null {
  const s = raw.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www|m|music)\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") id = u.searchParams.get("v");
    else {
      const m = u.pathname.match(/^\/(shorts|embed|live|v)\/([^/?#]+)/);
      if (m) id = m[2];
    }
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Required")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address").max(254);
