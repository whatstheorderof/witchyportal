import Link from "@/i18n/client";
import { connection } from "next/server";
import { retrogradePeriods, retroStatus, type RetroPeriod } from "@/lib/astro/retro";
import { solarHouse } from "@/lib/astro/sky";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { ukDate, ukDateShort, ukDateTime } from "@/lib/astro/format";
import { RETRO_HOUSE, type HouseKey } from "@/lib/astro/text/stars/transits";
import { RETRO_GUIDE, VENUS_MARS_RETRO } from "@/lib/astro/text/stars/guides";
import { absoluteUrl, breadcrumbLd, faqLd } from "@/lib/seo";
import { getReadings, type Rx } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { msg } from "@/i18n/config";
import { JsonLd } from "@/components/JsonLd";
import { Faqs, Prose } from "@/components/stars/Faqs";

const thisYear = () => Number(new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric" }).format(new Date()));

export async function generateMetadata() {
  await connection();
  const y = thisYear();
  const rx = await getReadings();
  return localeMeta({
    title: rx.t("Mercury Retrograde {y} & {y2}: Dates, Shadow Periods and Meaning | Witchy Portal", { y, y2: y + 1 }),
    absoluteTitle: true,
    description: rx.t("Every Mercury retrograde in {y} and {y2} with exact UK dates and times, the shadow periods, what it means for your sign, and Yulia Moon's ritual — plus Venus and Mars retrogrades.", { y, y2: y + 1 }),
    path: "/mercury-retrograde",
  });
}

const degOf = (rx: Rx, x: { sign: string; degree: number }) => `${Math.floor(x.degree)}° ${rx.t(x.sign)}`;

const yearRange = (y: number) => [new Date(Date.UTC(y, 0, 1)), new Date(Date.UTC(y + 1, 0, 1))] as const;

function PeriodCard({ p, n, rx }: { p: RetroPeriod; n: number; rx: Rx }) {
  const { t, intl } = rx, deg = (x: { sign: string; degree: number }) => degOf(rx, x);
  const rows: [string, string][] = [
    [t("Pre-shadow begins"), `${ukDate(p.preShadow, intl)} · ${t("Mercury reaches {deg}", { deg: deg(p.directDegree) })}`],
    [t("Retrograde begins"), `${ukDateTime(p.stationRetrograde, intl)} · ${deg(p.retroDegree)}`],
    [t("Turns direct"), `${ukDateTime(p.stationDirect, intl)} · ${deg(p.directDegree)}`],
    [t("Shadow ends"), `${ukDate(p.postShadow, intl)} · ${t("back at {deg}", { deg: deg(p.retroDegree) })}`],
  ];
  return (
    <li className="card p-6">
      <p className="eyebrow">{t("Retrograde {n}", { n })}</p>
      <h3 className="mt-1 font-display text-2xl text-plum">{ukDateShort(p.stationRetrograde, intl)} – {ukDateShort(p.stationDirect, intl)} · {p.signs.map((s) => `${SIGN_INFO[s].glyph} ${t(s)}`).join(" → ")}</h3>
      <dl className="mt-4 grid gap-2 text-[0.95rem]">
        {rows.map(([k, v]) => <div key={k} className="grid gap-1 sm:grid-cols-[10rem_1fr]"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </li>
  );
}

export default async function MercuryRetrograde() {
  await connection();
  const now = new Date(), y = thisYear();
  const years = [y, y + 1].map((yr) => ({ yr, mercury: retrogradePeriods("Mercury", ...yearRange(yr)) }));
  const status = retroStatus("Mercury", now);
  const focus = status.period;
  const rx = await getReadings();
  const { t, intl } = rx, deg = (x: { sign: string; degree: number }) => degOf(rx, x);
  const others = (["Venus", "Mars"] as const).map((b) => ({ b, periods: retrogradePeriods(b, yearRange(y)[0], yearRange(y + 1)[1]) }));

  const headline =
    status.state === "retrograde" ? t("Mercury is retrograde in {sign} now, until {date}.", { sign: t(focus!.sign), date: ukDate(focus!.stationDirect, intl) })
    : status.state === "pre-shadow" ? t("Mercury is in its pre-retrograde shadow. It turns retrograde in {sign} on {date}.", { sign: t(focus!.sign), date: ukDate(focus!.stationRetrograde, intl) })
    : status.state === "post-shadow" ? t("Mercury is direct again and in its post-retrograde shadow until {date}.", { date: ukDate(focus!.postShadow, intl) })
    : focus ? t("Mercury is direct. The next retrograde begins on {date} in {sign}.", { date: ukDate(focus.stationRetrograde, intl), sign: t(focus.sign) }) : t("Mercury is direct.");
  const guide = rx.deep(RETRO_GUIDE), vm = rx.deep(VENUS_MARS_RETRO);

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: t("Mercury retrograde {y} and {y2}", { y, y2: y + 1 }), inLanguage: rx.lang, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl("/mercury-retrograde"), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([[t("Astrology"), "/discover"], [t("Mercury retrograde"), "/mercury-retrograde"]]),
        faqLd(guide.faqs),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <p className="eyebrow text-blush">{t("Is Mercury retrograde?")}</p>
          <h1 className="display-lg mt-3 text-ivory">{t("Mercury retrograde {y} & {y2}", { y, y2: y + 1 })}</h1>
          <p className="mt-5 rounded-2xl bg-ivory/10 p-5 font-display text-2xl leading-snug text-ivory" aria-live="polite">{headline}</p>
          <p lang={rx.lang} className="mt-5 max-w-2xl text-ivory/85">{guide.intro}</p>
          <p className="mt-3 text-sm text-ivory/70">{t("All dates and times are UK time, calculated from the real positions of the planets.")}</p>
        </div>
      </section>
      <div className="container-page grid max-w-4xl gap-10 py-12">
        {years.map(({ yr, mercury }) => (
          <section key={yr} aria-labelledby={`y-${yr}`}>
            <h2 id={`y-${yr}`} className="font-display text-3xl text-plum">{t("Mercury retrograde dates {y}", { y: yr })}</h2>
            <ol className="mt-4 grid gap-4">{mercury.map((p, i) => <PeriodCard key={+p.stationRetrograde} p={p} n={i + 1} rx={rx} />)}</ol>
          </section>
        ))}

        {focus && (
          <section className="card p-6 sm:p-8" aria-labelledby="signs">
            <h2 id="signs" className="font-display text-2xl text-plum sm:text-3xl">{status.state === "direct" ? t("What the next retrograde means for your sign") : t("What this retrograde means for your sign")}</h2>
            <p className="mt-2 text-ink/80">{focus.signs.length > 1 ? t("Mercury turns retrograde in {sign} and slips back into {sign2}.", { sign: t(focus.sign), sign2: t(focus.signs[0]) }) : t("Mercury turns retrograde in {sign}.", { sign: t(focus.sign) })} {t("Read from your Sun sign (or rising sign, if you know it), with whole-sign houses.")}</p>
            <div className="mt-4 divide-y divide-line">
              {SIGNS.map((s) => {
                const h = solarHouse(s, focus.sign);
                return (
                  <details key={s} className="group py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-plum [&::-webkit-details-marker]:hidden">
                      <span><span aria-hidden className="me-2">{SIGN_INFO[s].glyph}</span>{t(s)} · {t("your {n} house", { n: rx.ord(h) })}</span>
                      <span aria-hidden className="text-plum-soft transition group-open:rotate-45">+</span>
                    </summary>
                    <p lang={rx.lang} className="mt-2 leading-relaxed text-ink/85">{rx(RETRO_HOUSE.Mercury[String(h) as HouseKey])}</p>
                  </details>
                );
              })}
            </div>
          </section>
        )}

        {([
          [msg("What Mercury retrograde is"), guide.whatItIs],
          [msg("The shadow periods"), guide.shadow],
          [msg("How it may show up"), guide.effects],
          [msg("What to do"), guide.do],
          [msg("What to avoid"), guide.avoid],
          [msg("Yulia's Mercury retrograde ritual"), guide.ritual],
        ] as const).map(([h, text], i) => (
          <section key={h} className={i === 5 ? "rounded-[2rem] bg-blush/40 p-6 sm:p-8" : "card p-6 sm:p-8"}>
            <h2 className="font-display text-2xl text-plum sm:text-3xl">{t(h)}</h2>
            <Prose text={text} className="mt-3" lang={rx.lang} />
          </section>
        ))}

        <section aria-labelledby="vm" className="grid gap-6">
          <h2 id="vm" className="font-display text-3xl text-plum">{t("Venus and Mars retrograde")}</h2>
          {others.map(({ b, periods }) => (
            <div key={b} className="card p-6 sm:p-8">
              <h3 className="font-display text-2xl text-plum">{t(b === "Venus" ? "Venus retrograde" : "Mars retrograde")}</h3>
              {periods.length ? (
                <ul className="mt-3 grid gap-2">
                  {periods.map((p) => <li key={+p.stationRetrograde}><strong className="font-medium">{ukDate(p.stationRetrograde, intl)} – {ukDate(p.stationDirect, intl)}</strong> · {t("{from} back to {to}", { from: deg(p.retroDegree), to: deg(p.directDegree) })} <span className="text-muted">({t("shadow {from} – {to}", { from: ukDateShort(p.preShadow, intl), to: ukDateShort(p.postShadow, intl) })})</span></li>)}
                </ul>
              ) : <p className="mt-3 text-muted">{t(b === "Venus" ? "No Venus retrograde in {y} or {y2}." : "No Mars retrograde in {y} or {y2}.", { y, y2: y + 1 })}</p>}
              <Prose text={b === "Venus" ? vm.venus : vm.mars} className="mt-4" lang={rx.lang} />
            </div>
          ))}
        </section>

        <Faqs items={guide.faqs} title={t("Questions people ask")} lang={rx.lang} />
        <p className="text-sm text-muted">{t("See every event as it happens in")} <Link href="/this-week-in-astrology" className="link-underline">{t("this week in astrology")}</Link>{t(", and the year’s")} <Link href="/eclipses" className="link-underline">{t("eclipses")}</Link>.</p>
      </div>
    </>
  );
}
