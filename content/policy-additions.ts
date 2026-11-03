/**
 * Paragraphs that must appear on the live policy pages (Admin → Pages).
 * On every deploy, the content sync adds any paragraph whose `marker` text is
 * missing from that page — just before the `before` heading if it exists,
 * otherwise at the end. Nothing else on the page is touched, so edits made in
 * the admin stay. To change wording later, edit it in Admin → Pages.
 */
export const POLICY_ADDITIONS: { slug: string; marker: string; before?: string; text: string }[] = [
  {
    slug: "privacy",
    marker: "Save my chart on this device",
    before: "## Videos",
    text: "If you tick **Save my chart on this device**, your birth date, time, place and optional name are kept in your own browser's local storage — not on our servers. They are sent to us only to calculate your personal daily horoscope, used in memory and not stored or logged. Choose **Forget my chart** (on the Today or Birth Chart page) or clear your browser data to remove them. Your chosen star sign is remembered in the same way.",
  },
  {
    slug: "privacy",
    marker: "## Payments",
    before: "## Videos",
    text: "## Payments\n\nWhen you pay on Witchy Portal (a retreat place or a compatibility report), payment is handled by Stripe under its own privacy policy. We never see or store your card details. We keep your name, email address, what you bought, the amount and the payment status, so we can confirm your booking or deliver your report and keep the accounts we are legally required to keep.\n\nFor a compatibility report we do not store the birth details you entered. They stay in your own browser, and we keep only a one-way code made from them, so we can recognise your purchase when the same details are entered again. If you ask us to email the report to you, it is sent once to the email address you paid with and not kept.",
  },
];
