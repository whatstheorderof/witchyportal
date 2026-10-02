# Priority review — October 2026

How the site matches the 24-point priority list. **Done** = built and tested. **Waiting** = built, but needs something only Yulia (or an account owner) can supply.

## 1 · Essential

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 1 | Clear opening screen with "Explore Retreats" | Done | Full-height hero, "Explore Retreats" is the main button, "Meet Yulia" second. |
| 2 | Next-retreat booking card | Done | Sits just under the hero: destination, dates, duration, price and availability, plus book / waitlist buttons. |
| 3 | Complete retreat information | **Waiting** | Page has a key-facts strip, section nav, "Is it for me?", experience, itinerary, stay & food, inclusions, travel, FAQs and terms. Anything not supplied yet shows as "to be announced" and is listed under "Still being finalised", so nothing is guessed. |
| 4 | Explicit booking options | Done | Each option shows *Deposit today / Total price / Remaining balance* and when the balance is due; the review page repeats them before payment. |
| 5 | Check every public interaction | Done | 31 booking/admin/chart checks, 9 favourites/share/Watch checks, a crawl of 63 internal links (no broken links) and an accessibility scan of 21 pages (no WCAG A/AA failures). |
| 6 | Mobile sticky booking bar above the bottom nav | Done | Sits directly above the tab bar, hides when the booking section or footer is on screen. |

## 2 · High

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 7 | Yulia on the homepage + welcome video | **Waiting** | "Meet Yulia" section is live. Paste a YouTube link into *Settings → Welcome video* to replace the portrait. |
| 8 | Real photography and dancing footage | **Waiting** | Uses Yulia's 4 beach photos. Needs venue photos and a 10–20s dance loop. |
| 9 | "Is this retreat for me?" | **Waiting** | Section and admin editor built; shows once Yulia writes the answers. Her own "this is for you if…" list is already on the page. |
| 10 | Consistent visual system | Done | Shared booking card, fact labels, buttons and colours across home, listing, detail and booking. |
| 11 | Separate desktop layouts | Done | Desktop retreat page has a booking card in a side column; homepage card goes wide. |
| 12 | "This week with Yulia" | Done | A video, an article and a tip, with dates. |
| 13 | Manageable weekly updates | Done | Uses the newest posts automatically, or pin items in *Settings*. Posts can be scheduled. |

## 3 · Next

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 14 | Ask a Witch browsing | Done | Ask a Witch hub plus the new **Watch** page (Witchy TV) with channels, auto-play next and a programme guide. |
| 15 | Shareable article/tip pages with related content and a retreat invitation | Done | Every tip, affirmation and motivation has its own page; all posts have Share, Save, "Keep reading" and a retreat invitation. |
| 16 | Approachable birth chart results | Done | Big three first, then a plain-English reading; degrees, houses and aspects fold away. |
| 17 | Verify chart calculations | Done | Checked against a published reference chart; covered by unit tests. |
| 18 | Favourites on the device | Done | Heart button on tips, posts and videos; `/favourites` page; nothing stored on the server. |
| 19 | Focused email signup + waitlist | Improved | Clear "what you'll get" list and specific confirmations. **Waiting:** automatic emails need a newsletter/email service. |
| 20 | Genuine guest feedback | **Waiting** | Deliberately empty — no invented testimonials. Collect real ones after the first retreat. |

## 4 · Polish

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 21 | Media and accessibility | Done for now | Alt text required, reduced-motion respected, accessibility scan clean. Re-check when real photos/video arrive. |
| 22 | Page previews for sharing | Done | Branded preview images for the homepage, retreats, articles, astrology and tips. |
| 23 | Measure the visitor journey without birth details | Done | *Admin → Insights* funnel. Anonymous; no birth details, names or IPs. |
| 24 | Verify the GitHub → Vercel workflow | After this push | Pushing to `main` deploys production; other branches get preview links. Check the deployment goes green after pushing. |

## What's needed to finish

**From Yulia (content):** retreat dates, prices, deposit and balance due date, location, day-by-day itinerary, accommodation, meals, travel guidance, "Is this for me?" answers, retreat FAQs, venue photos, a dancing clip, a welcome video link, a public contact email, and later real guest feedback.

**Accounts and settings:** payment links for each booking option (live and test), `ADMIN_EMAIL` / `ADMIN_PASSWORD` set in Vercel, `CRON_SECRET` for the daily YouTube check, and the witchyportal.com domain.

**Services not yet connected:** email notifications to Yulia, a newsletter platform (Kit, Mailchimp or Brevo), and automatic payment confirmation (Stripe webhooks). Until then, availability is managed by hand in the admin.
