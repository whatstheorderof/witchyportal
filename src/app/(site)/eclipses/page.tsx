import Link from "@/i18n/client";
import { connection } from "next/server";
import { eclipsesIn, type Eclipse } from "@/lib/astro/retro";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { ukDateTime } from "@/lib/astro/format";
import { mainAxis } from "@/lib/astro/eclipse-axis";
import { solarHouse } from "@/lib/astro/sky";
import { ECLIPSE_AXIS } from "@/lib/astro/text/stars/yearly";
import { ECLIPSE_GUIDE } from "@/lib/astro/text/stars/guides";
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
    title: rx.t("Eclipses {y} & {y2}: Dates, Signs and UK Visibility | Witchy Portal", { y, y2: y + 1 }),
    absoluteTitle: true,
    description: rx.t("Every solar and lunar eclipse in {y} and {y2}: exact UK dates and times, zodiac signs, whether you can see it from the UK, what it means for your sign, and how to work with eclipse season.", { y, y2: y + 1 }),
    path: "/eclipses",
  });
}

/** Every eclipse name, so each language can order the words its own way. */
const ECLIPSE_NAMES: string[] = [msg("Partial solar eclipse in {sign}"), msg("Annular solar eclipse in {sign}"), msg("Total solar eclipse in {sign}"), msg("Hybrid solar eclipse in {sign}"), msg("Solar eclipse in {sign}"), msg("Penumbral lunar eclipse in {sign}"), msg("Partial lunar eclipse in {sign}"), msg("Total lunar eclipse in {sign}"), msg("Lunar eclipse in {sign}")];
const eclipseName = (rx: Rx, e: Eclipse, sign: string) => {
  const key = ["Solar", "Lunar"].includes(e.kind) ? `${e.kind} eclipse in {sign}` : `${e.kind} ${e.type} eclipse in {sign}`;
  return rx.t(ECLIPSE_NAMES.includes(key) ? key : "Solar eclipse in {sign}", { sign });
};

function EclipseCard({ e, next, rx }: { e: Eclipse; next: boolean; rx: Rx }) {
  const t = rx.t;
  return (
    <li className={`card p-6 ${next ? "ring-2 ring-blush-deep/50" : ""}`}>
      <p className="eyebrow">{next ? `${t("Next eclipse")} · ` : ""}{e.type === "solar" ? t("Solar eclipse · New Moon") : t("Lunar eclipse · Full Moon")}</p>
      <h3 className="mt-1 font-display text-2xl text-plum"><span aria-hidden className="me-2">{SIGN_INFO[e.sign].glyph}</span>{eclipseName(rx, e, t(e.sign))}</h3>
      <p className="mt-2">{t("{date} (peak)", { date: ukDateTime(e.time, rx.intl) })} · {Math.floor(e.degree)}° {t(e.sign)}</p>
      <p className={`mt-2 text-sm ${e.visibleUk ? "text-plum" : "text-muted"}`}>{t(e.uk, { pct: e.ukPct ?? 0 })}</p>
    </li>
  );
}

export default async function Eclipses() {
  await connection();
  const y = thisYear(), now = +new Date();
  const years = [y, y + 1].map((yr) => ({ yr, list: eclipsesIn(yr) }));
  const all = years.flatMap((x) => x.list);
  const next = all.find((e) => +e.time > now);
  const nextYear = years.find(({ list }) => list.some((e) => +e.time > now)) ?? years[1];
  const rx = await getReadings();
  const { t, intl } = rx;
  const guide = rx.deep(ECLIPSE_GUIDE);
  const lowerFirst = (x: string) => x.charAt(0).toLocaleLowerCase(intl) + x.slice(1);

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: t("Eclipses {y} and {y2}", { y, y2: y + 1 }), inLanguage: rx.lang, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl("/eclipses"), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([[t("Astrology"), "/discover"], [t("Eclipses"), "/eclipses"]]),
        faqLd(guide.faqs),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <p className="eyebrow text-blush">{t("Eclipse season")}</p>
          <h1 className="display-lg mt-3 text-ivory">{t("Eclipses {y} & {y2}", { y, y2: y + 1 })}</h1>
          {next && <p className="mt-5 rounded-2xl bg-ivory/10 p-5 font-display text-2xl leading-snug text-ivory">{t("Next: {eclipse}, {date}.", { eclipse: lowerFirst(eclipseName(rx, next, t(next.sign))), date: ukDateTime(next.time, intl) })}</p>}
          <p lang={rx.lang} className="mt-5 max-w-2xl text-ivory/85">{guide.intro}</p>
          <p className="mt-3 text-sm text-ivory/70">{t("UK times. Visibility is calculated for London.")}</p>
        </div>
      </section>
      <div className="container-page grid max-w-4xl gap-10 py-12">
        {years.map(({ yr, list }) => (
          <section key={yr} aria-labelledby={`e-${yr}`}>
            <h2 id={`e-${yr}`} className="font-display text-3xl text-plum">{t("Eclipses in {y}", { y: yr })}</h2>
            <ol className="mt-4 grid gap-4 sm:grid-cols-2">{list.map((e) => <EclipseCard key={+e.time} e={e} next={e === next} rx={rx} />)}</ol>
          </section>
        ))}

        <section className="card p-6 sm:p-8" aria-labelledby="signs">
          <h2 id="signs" className="font-display text-2xl text-plum sm:text-3xl">{t("What the {y} eclipses mean for your sign", { y: nextYear.yr })}</h2>
          <p className="mt-2 text-ink/80">{t("Eclipses come in pairs across two opposite houses of your chart. Read from your Sun sign (or rising sign, if you know it).")}</p>
          <div className="mt-4 divide-y divide-line">
            {SIGNS.map((s) => {
              const axis = mainAxis(s, nextYear.list.map((e) => e.sign));
              if (!axis) return null;
              const [a, b] = axis.split("-").map(Number);
              const houses = [...new Set(nextYear.list.map((e) => t("{sign} ({n} house)", { sign: t(e.sign), n: rx.ord(solarHouse(s, e.sign)) })))];
              return (
                <details key={s} className="group py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-plum [&::-webkit-details-marker]:hidden">
                    <span><span aria-hidden className="me-2">{SIGN_INFO[s].glyph}</span>{t(s)} · {t("your {a} and {b} houses", { a: rx.ord(a), b: rx.ord(b) })}</span>
                    <span aria-hidden className="text-plum-soft transition group-open:rotate-45">+</span>
                  </summary>
                  <Prose text={rx(ECLIPSE_AXIS[axis])} className="mt-2" lang={rx.lang} />
                  <p className="mt-2 text-sm text-muted">{t("Eclipse signs in {y}: {list}.", { y: nextYear.yr, list: houses.join(", ") })}</p>
                </details>
              );
            })}
          </div>
        </section>

        {([
          [msg("What eclipses are"), guide.whatTheyAre],
          [msg("Solar eclipses"), guide.solar],
          [msg("Lunar eclipses"), guide.lunar],
          [msg("Eclipse season"), guide.season],
          [msg("Working with eclipse energy"), guide.work],
        ] as const).map(([h, text], i) => (
          <section key={h} className={i === 4 ? "rounded-[2rem] bg-blush/40 p-6 sm:p-8" : "card p-6 sm:p-8"}>
            <h2 className="font-display text-2xl text-plum sm:text-3xl">{t(h)}</h2>
            <Prose text={text} className="mt-3" lang={rx.lang} />
          </section>
        ))}
        <Faqs items={guide.faqs} title={t("Questions people ask")} lang={rx.lang} />
        <p className="text-sm text-muted">{t("Every New and Full Moon is in the")} <Link href="/moon" className="link-underline">{t("moon calendar")}</Link>. {t("See also")} <Link href="/mercury-retrograde" className="link-underline">{t("Mercury retrograde dates")}</Link>.</p>
      </div>
    </>
  );
}
