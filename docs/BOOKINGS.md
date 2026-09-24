# Bookings and payment links

## Data model

```
Retreat ──< Departure (dates, availability) ──< Booking option (label, amount, currency,
                                                 deposit|full, total price, availability,
                                                 live payment URL, test payment URL)
```

A visitor chooses **dates → option → reviews a summary** showing exactly what they're paying (deposit or full amount, total price, balance note), ticks the booking terms, and is redirected by the server to that option's hosted payment page.

## Operating mode: manually managed payment links

This is the mode currently implemented.

- The site **does not receive payment confirmations**. It never treats a visitor returning from the payment page as proof of payment.
- *Admin → Payment redirects* lists everyone who was sent to a payment page. These are **not** bookings.
- **To confirm a booking:** check the payment in your provider's dashboard → email the guest → update availability in admin (e.g. set an option to *Few places left* or *Sold out*, or a date to *Waitlist open*).
- Availability labels are set by hand; the site cannot prevent two people paying for the last place at the same moment. Keep a small buffer or switch to *Few places left* early.

## Setting up payment links (Stripe Payment Links example)

Any approved provider works (Stripe, PayPal, Revolut, SumUp, Square, Wise, GoCardless and others; add more with `PAYMENT_ALLOWED_HOSTS`). With Stripe:

1. Stripe Dashboard → **Payment Links → New**. Product name e.g. "Sea & Moon Retreat · 20–24 May 2027 · Shared room deposit". Set the **exact** amount you enter in admin.
2. *After payment* → **Don't show confirmation page → redirect to your website**: `https://your-domain.com/booking/return`
3. Turn on collecting the customer's name and phone if you need them.
4. Copy the link (`https://buy.stripe.com/…`) into the option's **LIVE payment link**.
5. Toggle Stripe into **Test mode**, create the same link, and paste it into **TEST payment link**. Preview deployments and local development always use the test link, so nobody is charged while testing.
   Test card: `4242 4242 4242 4242`, any future date, any CVC.

Each option needs its own link (one per date × room type × deposit/full). If an option has no link for the current environment, visitors are asked to contact you instead of paying.

## Validation

- Links must be `https://` on an approved host; they're re-checked on the server at checkout.
- A deposit needs a full price and must be lower than it.
- The payment URL is looked up on the server — it can't be altered from the browser.

## Moving to automatic confirmation (future)

If you later want automatic booking confirmation, the recommended path is Stripe Checkout Sessions created on the server plus a signed webhook (`checkout.session.completed`) that: verifies the signature, stores the event id to ignore repeats, records the booking, and decrements a per-option capacity inside a database transaction so the last place can't be sold twice. The data model already separates departures and options to support this.
