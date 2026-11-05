import type { Metadata } from "next";
import Link from "@/i18n/client";
import { connection } from "next/server";
import { retrogradePeriods, retroStatus, type RetroPeriod } from "@/lib/astro/retro";
import { solarHouse } from "@/lib/astro/sky";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { deg, ordinal, ukDate, ukDateShort, ukDateTime } from "@/lib/astro/format";
import { RETRO_HOUSE, type HouseKey } from "@/lib/astro/text/stars/transits";
import { RETRO_GUIDE, VENUS_MARS_RETRO } from "@/lib/astro/text/stars/guides";
import { absoluteUrl, breadcrumbLd, faqLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Faqs, Prose } from "@/components/stars/Faqs";

const thisYear = () => Number(new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric" }).format(new Date()));

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const y = thisYear();
  return pageMeta({
    title: `Mercury Retrograde ${y} & ${y + 1}: Dates, Shadow Periods and Meaning | Witchy Portal`,
    absoluteTitle: true,
    description: `Every Mercury retrograde in ${y} and ${y + 1} with exact UK dates and times, the shadow periods, what it means for your sign, and Yulia Moon's ritual — plus Venus and Mars retrogrades.`,
    path: "/mercury-retrograde",
  });
}

const yearRange = (y: number) => [new Date(Date.UTC(y, 0, 1)), new Date(Date.UTC(y + 1, 0, 1))] as const;

function PeriodCard({ p, n }: { p: RetroPeriod; n: number }) {
  const rows: [string, string][] = [
    ["Pre-shadow begins", `${ukDate(p.preShadow)} · Mercury reaches ${deg(p.directDegree)}`],
    ["Retrograde begins", `${ukDateTime(p.stationRetrograde)} · ${deg(p.retroDegree)}`],
    ["Turns direct", `${ukDateTime(p.stationDirect)} · ${deg(p.directDegree)}`],
    ["Shadow ends", `${ukDate(p.postShadow)} · back at ${deg(p.retroDegree)}`],
  ];
  return (
    <li className="card p-6">
      <p className="eyebrow">Retrograde {n}</p>
      <h3 className="mt-1 font-display text-2xl text-plum">{ukDateShort(p.stationRetrograde)} – {ukDateShort(p.stationDirect)} · {p.signs.map((s) => `${SIGN_INFO[s].glyph} ${s}`).join(" → ")}</h3>
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
  const others = (["Venus", "Mars"] as const).map((b) => ({ b, periods: retrogradePeriods(b, yearRange(y)[0], yearRange(y + 1)[1]) }));

  const headline =
    status.state === "retrograde" ? `Mercury is retrograde in ${focus!.sign} now, until ${ukDate(focus!.stationDirect)}.`
    : status.state === "pre-shadow" ? `Mercury is in its pre-retrograde shadow. It turns retrograde in ${focus!.sign} on ${ukDate(focus!.stationRetrograde)}.`
    : status.state === "post-shadow" ? `Mercury is direct again and in its post-retrograde shadow until ${ukDate(focus!.postShadow)}.`
    : focus ? `Mercury is direct. The next retrograde begins on ${ukDate(focus.stationRetrograde)} in ${focus.sign}.` : "Mercury is direct.";

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: `Mercury retrograde ${y} and ${y + 1}`, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl("/mercury-retrograde"), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([["Astrology", "/discover"], ["Mercury retrograde", "/mercury-retrograde"]]),
        faqLd(RETRO_GUIDE.faqs),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <p className="eyebrow text-blush">Is Mercury retrograde?</p>
          <h1 className="display-lg mt-3 text-ivory">Mercury retrograde {y} &amp; {y + 1}</h1>
          <p className="mt-5 rounded-2xl bg-ivory/10 p-5 font-display text-2xl leading-snug text-ivory" aria-live="polite">{headline}</p>
          <p className="mt-5 max-w-2xl text-ivory/85">{RETRO_GUIDE.intro}</p>
          <p className="mt-3 text-sm text-ivory/70">All dates and times are UK time, calculated from the real positions of the planets.</p>
        </div>
      </section>
      <div className="container-page grid max-w-4xl gap-10 py-12">
        {years.map(({ yr, mercury }) => (
          <section key={yr} aria-labelledby={`y-${yr}`}>
            <h2 id={`y-${yr}`} className="font-display text-3xl text-plum">Mercury retrograde dates {yr}</h2>
            <ol className="mt-4 grid gap-4">{mercury.map((p, i) => <PeriodCard key={+p.stationRetrograde} p={p} n={i + 1} />)}</ol>
          </section>
        ))}

        {focus && (
          <section className="card p-6 sm:p-8" aria-labelledby="signs">
            <h2 id="signs" className="font-display text-2xl text-plum sm:text-3xl">What {status.state === "direct" ? "the next" : "this"} retrograde means for your sign</h2>
            <p className="mt-2 text-ink/80">Mercury turns retrograde in {focus.sign}{focus.signs.length > 1 ? ` and slips back into ${focus.signs[0]}` : ""}. Read from your Sun sign (or rising sign, if you know it), with whole-sign houses.</p>
            <div className="mt-4 divide-y divide-line">
              {SIGNS.map((s) => {
                const h = solarHouse(s, focus.sign);
                return (
                  <details key={s} className="group py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-plum [&::-webkit-details-marker]:hidden">
                      <span><span aria-hidden className="mr-2">{SIGN_INFO[s].glyph}</span>{s} · your {ordinal(h)} house</span>
                      <span aria-hidden className="text-plum-soft transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-2 leading-relaxed text-ink/85">{RETRO_HOUSE.Mercury[String(h) as HouseKey]}</p>
                  </details>
                );
              })}
            </div>
          </section>
        )}

        {([
          ["What Mercury retrograde is", RETRO_GUIDE.whatItIs],
          ["The shadow periods", RETRO_GUIDE.shadow],
          ["How it may show up", RETRO_GUIDE.effects],
          ["What to do", RETRO_GUIDE.do],
          ["What to avoid", RETRO_GUIDE.avoid],
          ["Yulia's Mercury retrograde ritual", RETRO_GUIDE.ritual],
        ] as const).map(([t, text], i) => (
          <section key={t} className={i === 5 ? "rounded-[2rem] bg-blush/40 p-6 sm:p-8" : "card p-6 sm:p-8"}>
            <h2 className="font-display text-2xl text-plum sm:text-3xl">{t}</h2>
            <Prose text={text} className="mt-3" />
          </section>
        ))}

        <section aria-labelledby="vm" className="grid gap-6">
          <h2 id="vm" className="font-display text-3xl text-plum">Venus and Mars retrograde</h2>
          {others.map(({ b, periods }) => (
            <div key={b} className="card p-6 sm:p-8">
              <h3 className="font-display text-2xl text-plum">{b} retrograde</h3>
              {periods.length ? (
                <ul className="mt-3 grid gap-2">
                  {periods.map((p) => <li key={+p.stationRetrograde}><strong className="font-medium">{ukDate(p.stationRetrograde)} – {ukDate(p.stationDirect)}</strong> · {deg(p.retroDegree)} back to {deg(p.directDegree)} <span className="text-muted">(shadow {ukDateShort(p.preShadow)} – {ukDateShort(p.postShadow)})</span></li>)}
                </ul>
              ) : <p className="mt-3 text-muted">No {b} retrograde in {y} or {y + 1}.</p>}
              <Prose text={b === "Venus" ? VENUS_MARS_RETRO.venus : VENUS_MARS_RETRO.mars} className="mt-4" />
            </div>
          ))}
        </section>

        <Faqs items={RETRO_GUIDE.faqs} />
        <p className="text-sm text-muted">See every event as it happens in <Link href="/this-week-in-astrology" className="link-underline">this week in astrology</Link>, and the year&rsquo;s <Link href="/eclipses" className="link-underline">eclipses</Link>.</p>
      </div>
    </>
  );
}
