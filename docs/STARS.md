# Horoscopes, compatibility and moon guides

Everything here is generated from the real sky (Astronomy Engine, UK time) and original text written in Yulia's voice (`src/lib/astro/text/stars/`, brief in `VOICE.md` there; about 100,000 words). Nothing needs writing day to day.

| Page | What it is | Built from |
| --- | --- | --- |
| `/today` | "Your day" splash screen: today's Moon, headline, love/work/energy ratings, the reading and Yulia's ritual | `dailyHoroscope()` in `src/lib/astro/horoscope.ts` |
| `/horoscope`, `/horoscope/[sign]` (`?day=yesterday|tomorrow`) | Daily horoscopes | The Moon's solar house for the sign, its phase, its most important exact aspect today, retrogrades |
| `/horoscope/[sign]/monthly` (`?m=YYYY-MM`) | Monthly horoscope | Sun, Mercury, Venus, Mars, Jupiter, Saturn through the sign's solar houses; the month's New and Full Moon; retrogrades; key dates |
| `/this-week-in-astrology` (`?week=`) | The week's real events for everyone, with a seven-day calendar (each day's Moon and events, linking to the full readings) | Ingresses, stations, exact aspects between planets, lunations, eclipses, the Moon's signs (`src/lib/astro/sky.ts`) |
| `/compatibility`, `/compatibility/[a]-and-[b]` | Star sign compatibility test, 78 pairings | `SUN_PAIRS_*`; scores from the signs' relationship (trine, square…) |
| `/compatibility/love` | Love-sign (Venus) compatibility from two birth dates | `VENUS_PAIRS`, `VENUS_LOVE_STYLE` |
| `/compatibility/birth-chart` | Birth chart compatibility (synastry): **paid report, £14.99** | `synastry()` in `src/lib/astro/compat.ts` |
| `/moon/phases` | Moon phases guide + this month's phase calendar | `PHASE_GUIDE`, lunations |
| `/horoscope/[sign]/[year]` (this year and next) | Yearly horoscope: Jupiter's and Saturn's houses (with ingress dates), the eclipse axis, Mercury/Venus/Mars retrogrades, every New and Full Moon month by month, a ritual | `yearlyHoroscope()` in `src/lib/astro/yearly.ts`; texts in `stars/yearly.ts`. Linked from the hub and each sign page; from October the featured year is next year |
| `/calculators` + `/rising-sign-calculator`, `/moon-sign-calculator`, `/big-three-calculator`, `/venus-sign-calculator`, `/mars-sign-calculator`, `/saturn-return-calculator` | Single-question calculators with explainer and FAQ (FAQ rich results) | `POST /api/calc` → `calculate()` in `src/lib/astro/calc.ts`; Saturn returns are the exact moments transiting Saturn returns to its birth degree; texts `CALC_GUIDE` |
| `/mercury-retrograde` | "Is Mercury retrograde?" now, every retrograde this year and next with pre-shadow, stations (UK time) and post-shadow, per-sign meaning, Venus and Mars retrogrades | `retrogradePeriods()` / `retroStatus()` in `src/lib/astro/retro.ts`; `RETRO_GUIDE`, `RETRO_HOUSE` |
| `/eclipses` | Every eclipse this year and next: type, UK time, sign, visibility from London; per-sign eclipse axis | `eclipsesIn()` in `retro.ts`; `ECLIPSE_GUIDE`, `ECLIPSE_AXIS` |
| `/chinese-zodiac`, `/chinese-zodiac/[animal]`, `/chinese-zodiac/2027` | Animal + element finder (uses Lunar New Year), the twelve animals, traditional compatibility (trines, secret friends, clashes, harm pairs), the five elements, the Fire Goat year | `src/lib/astro/chinese.ts` (Lunar New Year = second New Moon after the December solstice, China time; tested against published dates) and `chinese-rules.ts`; texts `chinese-animals.ts`, `chinese-year.ts`. The 2027 page needs a new year's text each year |

Daily text variants are picked from the date and sign, so a page reads the same all day and changes each day. Horoscopes are read from Sun signs with whole-sign solar houses.

## The daily greeting ("splash")

Visitors who pick a sign (stored only in their browser, `localStorage`) are greeted once a day with their astrological day when they open the site. It can be switched off on `/today` or in the card. It never shows on `/today` or `/horoscope/…`, and seeing your day anywhere counts as the day's greeting.

## Personal horoscopes (chart saved on the device)

On `/birth-chart`, visitors can tick **Save my chart on this device**. Their birth date, time, place id and optional name are kept in their browser only (`localStorage` key `witchy:chart`, `src/lib/my-chart.ts`). "Your day" (`/today`, Discover, the horoscope hub) then posts them to `POST /api/today/personal` (no-store; nothing is stored or logged) and shows a personal day: the Moon through their natal houses (solar houses without a birth time), plus today's strongest transits to their natal planets and angles — one from the Moon, one from the Sun/Mercury/Venus/Mars, and up to two slow transits (Jupiter to Pluto within 1.5°). Texts: `TRANSIT_1/2/3` keyed `"Transit>Natal"`. "Forget my chart" removes it. The privacy policy seed has a matching paragraph — **update the live Privacy page in Admin with it**.

## Birth chart compatibility: payment is not switched on yet

- Everyone gets the free preview: overall and five area scores (love, communication, passion, stability, growth), each person's Sun/Moon/Venus/rising, and the three strongest connections. Everything else is listed but locked, with a "launching soon" email sign-up (subscribers, source `synastry-report`).
- Signed-in admins see the full report (every inter-aspect and house overlay), to check it.
- To launch it: create a Stripe Checkout product (£14.99), verify the payment on the server with Stripe's webhook, then unlock the report. Because the report must be re-created after payment, the two people's birth details would need to be kept (encrypted, with consent, and deleted after delivery) — today they are never stored. `SYNASTRY_PRICE` is in `compat.ts`; `/api/synastry` returns `full` only when unlocked.
