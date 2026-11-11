import "server-only";
/**
 * Email through Brevo (https://www.brevo.com) — mailing lists and the
 * occasional transactional email (waitlist confirmations, notifications).
 *
 * Everything is optional and best-effort: without BREVO_API_KEY nothing is
 * sent, and a Brevo failure never stops a form from saving. The database
 * stays the record of every sign-up (Admin → Inbox).
 *
 * Environment (Vercel → Settings → Environment Variables):
 *   BREVO_API_KEY             API key (Brevo → SMTP & API → API keys)
 *   BREVO_SENDER_EMAIL        a sender verified in Brevo, e.g. hello@witchyportal.org
 *   BREVO_SENDER_NAME         optional, default "Witchy Portal"
 *   BREVO_LIST_NEWSLETTER     list ID for newsletter sign-ups
 *   BREVO_LIST_WAITLIST       list ID for retreat waitlist sign-ups
 *   BREVO_LIST_REPORTS        optional list ID for "tell me when the compatibility report launches"
 *   BREVO_LIST_MOON           list ID for New and Full Moon reminder emails (sent by /api/cron/moon-email)
 */

const API = "https://api.brevo.com/v3";
const key = () => process.env.BREVO_API_KEY?.trim();
export type ListName = "NEWSLETTER" | "WAITLIST" | "REPORTS" | "MOON";
export const listId = (name: ListName) => {
  const n = Number(process.env[`BREVO_LIST_${name}`]);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export const emailEnabled = () => Boolean(key());

async function brevo(path: string, body: unknown) {
  return (await brevoJson(path, body)) !== null;
}

/** POST to Brevo; the parsed JSON response ({} when empty), or null on failure. */
async function brevoJson(path: string, body: unknown): Promise<Record<string, unknown> | null> {
  const k = key();
  if (!k) return null;
  try {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "api-key": k, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok && res.status !== 204) {
      console.error(`brevo ${path} failed`, res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const text = await res.text();
    return text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch (e) {
    console.error(`brevo ${path} error`, e instanceof Error ? e.message : e);
    return null;
  }
}

/** Add or update a contact and put them on a list. */
export async function addToList(list: ListName, email: string, attributes: Record<string, string> = {}) {
  const id = listId(list) ?? (list === "REPORTS" ? listId("NEWSLETTER") : null);
  if (!id) return false;
  return brevo("/contacts", { email, listIds: [id], updateEnabled: true, attributes });
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** A simple branded email. `paragraphs` are plain text (escaped here). */
function layout(heading: string, paragraphs: string[], opts: { footerHtml?: string; afterHtml?: string } = {}) {
  const footer = opts.footerHtml ?? esc("Witchy Portal · witchyportal.org");
  const ps = paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#2b1a27">${esc(p).replace(/\n/g, "<br>")}</p>`).join("");
  return `<!doctype html><html><body style="margin:0;background:#fbf6ef;font-family:Georgia,'Times New Roman',serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf6ef;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden">
<tr><td style="background:#2a1025;padding:22px 28px;color:#fbf6ef;font-size:22px">☽ Witchy Portal</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:26px;font-weight:normal;color:#4a1f40">${esc(heading)}</h1>${ps}${opts.afterHtml ?? ""}
</td></tr>
<tr><td style="padding:16px 28px 24px;font-size:12px;color:#6a5664;font-family:Arial,sans-serif">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}

export async function sendEmail(o: { to: string; toName?: string; subject: string; heading: string; paragraphs: string[]; replyTo?: string }) {
  const sender = process.env.BREVO_SENDER_EMAIL?.trim();
  if (!sender) return false;
  return brevo("/smtp/email", {
    sender: { email: sender, name: process.env.BREVO_SENDER_NAME?.trim() || "Witchy Portal" },
    to: [{ email: o.to, ...(o.toName ? { name: o.toName } : {}) }],
    ...(o.replyTo ? { replyTo: { email: o.replyTo } } : {}),
    subject: o.subject,
    htmlContent: layout(o.heading, o.paragraphs),
    textContent: [o.heading, ...o.paragraphs].join("\n\n"),
  });
}

/**
 * Create an email campaign for one list and send it now (Brevo handles the
 * unsubscribe link and per-contact sending). Returns the campaign id, or null.
 */
export async function sendCampaign(o: { list: ListName; name: string; subject: string; heading: string; paragraphs: string[]; cta?: { label: string; url: string }; reason: string }) {
  const id = listId(o.list);
  const sender = process.env.BREVO_SENDER_EMAIL?.trim();
  if (!id || !sender || !key()) return null;
  const cta = o.cta
    ? `<p style="margin:22px 0 6px"><a href="${esc(o.cta.url)}" style="display:inline-block;background:#4a1f40;color:#fbf6ef;text-decoration:none;padding:12px 22px;border-radius:999px;font-family:Arial,sans-serif;font-size:15px">${esc(o.cta.label)}</a></p>`
    : "";
  const footer = `Witchy Portal · witchyportal.org — ${esc(o.reason)} <a href="{{ unsubscribe }}" style="color:#6a5664">Unsubscribe</a>`;
  const html = layout(o.heading, o.paragraphs, { footerHtml: footer, afterHtml: cta });
  const created = await brevoJson("/emailCampaigns", {
    name: o.name,
    subject: o.subject,
    sender: { email: sender, name: process.env.BREVO_SENDER_NAME?.trim() || "Witchy Portal" },
    htmlContent: html,
    recipients: { listIds: [id] },
  });
  const cid = created && typeof created.id === "number" ? created.id : null;
  if (!cid) return null;
  return (await brevo(`/emailCampaigns/${cid}/sendNow`, {})) ? cid : null;
}
