# Horoscopes, compatibility and moon guides

Everything here is generated from the real sky (Astronomy Engine, UK time) and original text written in Yulia's voice (`src/lib/astro/text/stars/`, brief in `VOICE.md` there; about 100,000 words). Nothing needs writing day to day.

| Page | What it is | Built from |
| --- | --- | --- |
| `/today` | "Your day" splash screen: today's Moon, headline, love/work/energy ratings, the reading and Yulia's ritual | `dailyHoroscope()` in `src/lib/astro/horoscope.ts` |
| `/horoscope`, `/horoscope/[sign]` (`?day=yesterday|tomorrow`) | Daily horoscopes | The Moon's solar house for the sign, its phase, its most important exact aspect today, retrogrades |
| `/horoscope/[sign]/monthly` (`?m=YYYY-MM`) | Monthly horoscope | Sun, Mercury, Venus, Mars, Jupiter, Saturn through the sign's solar houses; the month's New and Full Moon; retrogrades; key dates |
| `/this-week-in-astrology` (`?week=`) | The week's real events for everyone | Ingresses, stations, exact aspects between planets, lunations, eclipses, the Moon's signs (`src/lib/astro/sky.ts`) |
| `/compatibility`, `/compatibility/[a]-and-[b]` | Star sign compatibility test, 78 pairings | `SUN_PAIRS_*`; scores from the signs' relationship (trine, square…) |
| `/compatibility/love` | Love-sign (Venus) compatibility from two birth dates | `VENUS_PAIRS`, `VENUS_LOVE_STYLE` |
| `/compatibility/birth-chart` | Birth chart compatibility (synastry): **paid report, £14.99** | `synastry()` in `src/lib/astro/compat.ts` |
| `/moon/phases` | Moon phases guide + this month's phase calendar | `PHASE_GUIDE`, lunations |

Daily text variants are picked from the date and sign, so a page reads the same all day and changes each day. Horoscopes are read from Sun signs with whole-sign solar houses.

## The daily greeting ("splash")

Visitors who pick a sign (stored only in their browser, `localStorage`) are greeted once a day with their astrological day when they open the site. It can be switched off on `/today` or in the card. It never shows on `/today` or `/horoscope/…`, and seeing your day anywhere counts as the day's greeting.

## Birth chart compatibility: payment is not switched on yet

- Everyone gets the free preview: overall and five area scores (love, communication, passion, stability, growth), each person's Sun/Moon/Venus/rising, and the three strongest connections. Everything else is listed but locked, with a "launching soon" email sign-up (subscribers, source `synastry-report`).
- Signed-in admins see the full report (every inter-aspect and house overlay), to check it.
- To launch it: create a Stripe Checkout product (£14.99), verify the payment on the server with Stripe's webhook, then unlock the report. Because the report must be re-created after payment, the two people's birth details would need to be kept (encrypted, with consent, and deleted after delivery) — today they are never stored. `SYNASTRY_PRICE` is in `compat.ts`; `/api/synastry` returns `full` only when unlocked.
