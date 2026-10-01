# Witchy Portal — improvements list

Last updated 1 October 2026. Effort: **S** = under a day, **M** = 1–3 days, **L** = a week or more.

## 1. Before launch — needs Yulia

| # | What | Why |
| --- | --- | --- |
| 1.1 | **Retreat details**: dates, location, price and deposit, what's included and not, accommodation, a day-by-day outline, cancellation terms | "Awaken the Wild Goddess" is live but has no dates or prices yet, so it currently only collects waitlist sign-ups. |
| 1.2 | **Payment links** for each booking option (live and test) | So guests can actually pay. Stripe Payment Links are the simplest option — see docs/BOOKINGS.md. |
| 1.3 | **Point witchyportal.com at the new site** | Her YouTube channel already links to witchyportal.com. Add the domain in Vercel → Domains. |
| 1.4 | A **public contact email** | The Contact page currently offers the form and Instagram only. |
| 1.5 | **Check the About page wording** | "Why time away matters", "Why Yulia hosts" and "What she hopes you take home" were written from her channel description. |
| 1.6 | **Retreat photos and dancing footage** | Venue photos for the retreat gallery; a 10–20s silent dance loop for the homepage hero. |
| 1.7 | **Legal review** of booking terms, privacy and cookies pages | They're templates. |
| 1.8 | **Real FAQs** for the retreat (fitness level, travel, dietary needs, solo travellers…) | The FAQ section is hidden until there are answers. |

## 2. Quick wins (S)

1. **Email Yulia when someone enquires or joins the waitlist** (via Resend or Postmark) — right now she has to check /admin.
2. **Privacy-friendly analytics** (Vercel Web Analytics) and a count of "Continue to payment" clicks per retreat.
3. **Install as an app** (web app manifest + icons) so fans can add Witchy Portal to their home screen.
4. **Share images**: automatic social preview cards for every article, astrology post, tarot card and retreat.
5. **Moon calendar → phone calendar**: an "Add to calendar" feed (.ics) of new and full moons.
6. **Etsy picks**: a small "From Yulia's shop" strip on relevant articles and the Socials page.

## 3. Grow the audience (M)

1. **Newsletter platform** — connect sign-ups to Kit, Mailchimp or Brevo with double opt-in, and send a welcome email with a free ritual guide.
2. **Weekly horoscopes by sign** — 12 short readings a week, published from the content folder.
3. **Tarot**: extend to the full 78-card deck and add three-card spreads (past · present · future).
4. **Birth chart**: let visitors download or share their chart; add Yulia's own interpretations; add a compatibility (synastry) check.
5. **Instagram feed** on the Socials page (needs a Meta developer token).
6. **"Is this retreat for me?" quiz** that ends with the waitlist — a gentle lead magnet.

## 4. Earn more (M–L)

1. **Readings & services page** — 1:1 tarot readings, dream interpretation, energy cleansing — with booking and payment (Calendly + Stripe), once Yulia confirms what she offers.
2. **Automatic booking confirmation** — Stripe Checkout with webhooks: confirms the place, emails the guest, and reduces availability so the last place can't be sold twice.
3. **Deposits and balance reminders** — automatic emails before the balance is due.
4. **Testimonials** — collect real reviews after the first retreat (never invented).
5. **Gift vouchers** for retreats and readings.

## 5. Admin & quality (S–M)

1. A friendlier editor with live preview for articles.
2. Image cropping/focal point for hero images.
3. A content calendar view showing what's scheduled week by week.
4. Full accessibility and performance check once real photos and copy are in.
