# Birth chart

## Provider

`src/lib/astro/` contains a typed provider boundary (`ChartProvider` → `ChartResult`). The default provider is **Astronomy Engine** (`astronomy-engine`, MIT licence, VSOP87/NOVAS models), run on our server — no third-party API, no key, no cost.

Set `BIRTH_CHART_PROVIDER=fixture` to use obviously fake **development fixture** data (shown with a warning banner) when working on the interface.

## Conventions

| | |
| --- | --- |
| Zodiac | Tropical, true ecliptic of date, apparent geocentric positions |
| Bodies | Sun, Moon, Mercury–Pluto, mean North Node |
| Angles | Ascendant, Midheaven (and Descendant, IC) |
| Houses | **Placidus**; **Whole Sign** automatically above ±66° latitude where Placidus is undefined |
| Aspects | Conjunction 8°, opposition 8°, square 7°, trine 7°, sextile 5° (Node excluded) |

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

## Interpretation text

Kept separate from calculations in `src/lib/astro/interpretations.ts` — neutral placeholder descriptions Yulia can rewrite. A future step could move them into the admin.
