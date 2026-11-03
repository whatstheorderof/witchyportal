# Stripe — everything is built; connecting it is the last step

Stripe takes two kinds of payment on the site:

1. **Retreat places** — Stripe Checkout with automatic confirmation. Each booking option can use either its payment link (as today) or Stripe Checkout. With Stripe Checkout:
   - the option's **places** (capacity) are counted, and a place is held for 30 minutes while the guest pays, so the last place can't be sold twice;
   - the booking is confirmed only when Stripe's **signed webhook** (or a server-side check with Stripe) says it's paid — never because the guest came back to the site;
   - the guest gets a confirmation email and Yulia gets a "new booking" email (needs Brevo, see EMAIL.md);
   - when every place is paid, the option switches to **Sold out** automatically (and to *Limited* when two or fewer are left);
   - a payment that arrives after the last place went to someone else is marked **Needs attention** and Yulia is emailed.
2. **The birth chart compatibility report (£14.99)** — the "Unlock the full report" button on /compatibility/birth-chart. No birth details are stored: they stay in the visitor's browser, and the server keeps only an HMAC (one-way code) of them to recognise the purchase. After paying, the report opens straight away; it can be printed, saved as PDF, emailed to the address used at checkout, and reopened on the same device.

Everything lives in: `src/lib/stripe.ts` (keys and safety checks), `src/lib/orders.ts` (holds, payments, availability, emails), `src/app/api/stripe/webhook/route.ts`, `src/app/api/checkout/route.ts` (retreats), `src/app/api/synastry/{checkout,email}`, `src/lib/report-purchase.ts`, the `orders` and `stripe_events` tables (migration 0007), Admin → **Orders** and Admin → Settings → **Payments**. Tests: `tests/stripe.test.ts` (signed webhooks, double-booking race, sold out, amount mismatch).

Until the keys are set nothing changes on the site.

## Connecting it (with Yulia, about 20 minutes)

### 1. Stripe account (Yulia's)
- Yulia signs up at stripe.com **with her own business details and bank account** (she must do this herself — identity checks and bank details are hers). Business name, statement descriptor e.g. `WITCHY PORTAL`, support email, and turn on the payment methods she wants (cards, Apple Pay/Google Pay, Link) under Settings → Payment methods.
- Settings → Branding: logo, colours (plum `#4a1f40`, ivory `#fbf6ef`) — this styles the Checkout page and receipts.
- Settings → Customer emails: turn on **Successful payments** and **Refunds** so Stripe sends receipts.

### 2. Test mode first
1. In Stripe, switch on **Test mode** → Developers → API keys → copy the **Secret key** (`sk_test_…`). A restricted key also works; it needs write access to *Checkout Sessions* and read access to *Charges* and *Events*.
2. Developers → Webhooks → **Add endpoint**:
   - URL: `https://witchyportal.org/api/stripe/webhook` (for previews, use the preview URL, or test on production in test mode — see below)
   - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, `charge.refunded`
   - Copy the **Signing secret** (`whsec_…`).
3. Vercel → Project → Settings → Environment Variables:
   - `STRIPE_SECRET_KEY` = `sk_test_…`, `STRIPE_WEBHOOK_SECRET` = `whsec_…` — for **Production** while testing (then swap to live), or for **Preview** if you test on a preview deployment
   - `REPORT_SECRET` = 40 random characters (e.g. from a password manager) — set once, never change it (changing it would forget past report purchases)
   - Redeploy.
   - The site refuses a **live** key on a preview/test deployment, so real money can't be taken by accident.
4. Admin → Settings → Payments should say **Connected in test mode**.
5. Try it:
   - Admin → Retreats → an option → *How guests pay* = **Stripe Checkout**, *Places* = e.g. 8. Save.
   - Book it on the site, pay with card `4242 4242 4242 4242`, any future date, any CVC. You should land on "Your place is booked", see it in Admin → Orders, and get the emails.
   - /compatibility/birth-chart → compare two charts → **Unlock the full report** → pay with 4242… → the full report opens.
   - Refund one in Stripe → it shows as Refunded in Admin → Orders.

### 3. Go live
1. Stripe: switch off Test mode, finish account activation, copy the **live** secret key, and add the same webhook endpoint in live mode (new `whsec_…`).
2. Vercel **Production** env vars: `STRIPE_SECRET_KEY` = `sk_live_…`, `STRIPE_WEBHOOK_SECRET` = the live `whsec_…`. Keep the test keys on **Preview**. Redeploy.
3. Admin → Settings → Payments: **Connected in live mode**. Set each retreat option to Stripe Checkout with the right number of places.
4. Optional: `SYNASTRY_SALES=off` keeps the report off sale while retreats use Stripe.

## Notes
- Prices come from the admin (retreat options) and `SYNASTRY_PRICE` in `src/lib/astro/compat.ts` — no products need creating in Stripe.
- Refunds are made in Stripe. After a refund, set the option's availability back by hand if you want to sell that place again.
- Deposits: the option's amount is what Stripe charges; the balance is collected separately (e.g. a Stripe invoice or payment link) as today.
- Privacy: the Payments section of the privacy policy is added to the live page automatically on deploy (content/policy-additions.ts).
