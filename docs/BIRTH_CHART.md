# Birth chart

## Provider

`src/lib/astro/` contains a typed provider boundary (`ChartProvider` → `ChartResult`). The default provider is **Astronomy Engine** (`astronomy-engine`, MIT licence, VSOP87/NOVAS models), run on our server — no third-party API, no key, no cost.

Set `BIRTH_CHART_PROVIDER=fixture` to use obviously fake **development fixture** data (shown with a warning banner) when working on the interface.

## Conventions

| | |
| --- | --- |
| Zodiac | Tropical, true ecliptic of date, apparent geocentric positions |
| Bodies | Sun, Moon, Mercury–Pluto, **true** North Node (osculating, from the Moon's orbit), mean Black Moon Lilith (mean lunar apogee) |
| Points | South Node (opposite the North Node); Part of Fortune, classic formula Ascendant + Moon − Sun |
| Angles | Ascendant, Midheaven (and Descendant, IC) |
| Houses | **Placidus**; **Whole Sign** automatically above ±66° latitude where Placidus is undefined |
| Aspects | Planets and angles: conjunction/opposition 10°, square/trine 8°, sextile 5° (60% of that between two outer planets). North Node and Lilith: 6°/4°/3°, to planets only. Strength = closeness to exact; applying/separating from daily motion |
| Balance | Elements, modalities and polarity counted over the ten planets |
| Moon phase | Eight phases by the Moon's distance ahead of the Sun (45° each) |

Checked against a Cafe Astrology (Swiss Ephemeris) natal report in `tests/natal-report.test.ts`: planets, Lilith and Part of Fortune agree to within 3′ and the aspect list is identical. The one difference is the true North Node (ours 5°24′ Sagittarius for that chart, theirs 5°00′); two independent calculations here agree on ours, and published true-node values vary slightly between programs.

## Places and time zones

- Birthplaces come from GeoNames "cities1000" (every place with ≥1000 people), bundled in the `all-the-cities` package; the time zone is found from the coordinates with `tz-lookup`. Nothing is sent to an external service.
- Local birth time → UTC uses the IANA time-zone database (historical DST and wartime rules included). Non-existent times (clocks going forward) and ambiguous times (clocks going back) are flagged to the visitor.
- Before a region adopted standard time, true **Local Mean Time** for the birthplace's longitude is used.

## Unknown birth time

Positions are shown for local noon. The Ascendant, Midheaven and houses are not shown; any body that changed sign during that day (usually the Moon) is shown with both possible signs and excluded from aspects.

## Privacy

Birth details are sent to `/api/chart`, used in memory and returned — they are not stored or logged.

## Verification

`tests/astro.test.ts` checks the engine against Albert Einstein's published chart (14 Mar 1879, 11:30 LMT, Ulm; Rodden rating AA): all planets within 0.1° (actual differences under 1 arcminute), Ascendant 11°38′ Cancer and MC 12°50′ Pisces reproduced. It also verifies Placidus cusp geometry, polar fallback, DST gaps/overlaps and historical offsets. Run `npm test`.

## The written report

`src/lib/astro/report.ts` builds the report on the server (`/api/chart` returns `{ chart, report }`), so only the paragraphs for that chart reach the browser — about 8,000 words for a chart with a birth time.

All text is original Witchy Portal copy in `src/lib/astro/text/` (about 85,000 words):

| File | Contents |
| --- | --- |
| `sun.ts`, `moon.ts`, `mercury.ts`, `venus.ts`, `mars.ts`, `jupiter.ts`, `saturn.ts` | Planet in each sign (with a one-line summary) |
| `outer.ts`, `lilith.ts`, `node.ts` | Uranus/Neptune/Pluto, Lilith, North Node and Part of Fortune in each sign |
| `houses-personal.ts`, `houses-outer.ts` | Every planet and point in each house |
| `aspects-1.ts` … `aspects-3.ts`, `points.ts` | Every planet/angle pair: conjunction, trine/sextile, square, opposition; Node and Lilith aspects; element/modality balance |
| `angles.ts`, `cusps.ts` | Ascendant and Midheaven in each sign, what each house means, and each sign on each house cusp |
| `moon-phase.ts` | The eight birth Moon phases |
| `zodiac-1.ts`, `zodiac-2.ts` | The sign guides on /zodiac/[sign] |

`BRIEF.md` in that folder is the writing brief (voice, rules, word counts). After editing, run `npx tsx scripts/check-astro-text.ts src/lib/astro/text/<file>.ts`; `npm test` checks that 200 random charts all get complete text.

## Search (SEO)

/birth-chart targets "birth chart" and "natal chart": keyword title and heading, a guide and FAQs under the calculator, and WebApplication + FAQPage structured data. /natal-chart and /birthchart redirect to it. The twelve /zodiac/[sign] guides link to and from the calculator and every report links each sign to its guide.
