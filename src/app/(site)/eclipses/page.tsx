import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { eclipsesIn, type Eclipse } from "@/lib/astro/retro";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { deg, ordinal, ukDateTime } from "@/lib/astro/format";
import { mainAxis } from "@/lib/astro/eclipse-axis";
import { solarHouse } from "@/lib/astro/sky";
import { ECLIPSE_AXIS } from "@/lib/astro/text/stars/yearly";
import { ECLIPSE_GUIDE } from "@/lib/astro/text/stars/guides";
import { absoluteUrl, breadcrumbLd, faqLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Faqs, Prose } from "@/components/stars/Faqs";

const thisYear = () => Number(new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric" }).format(new Date()));

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const y = thisYear();
  return pageMeta({
    title: `Eclipses ${y} & ${y + 1}: Dates, Signs and UK Visibility | Witchy Portal`,
    absoluteTitle: true,
    description: `Every solar and lunar eclipse in ${y} and ${y + 1}: exact UK dates and times, zodiac signs, whether you can see it from the UK, what it means for your sign, and how to work with eclipse season.`,
    path: "/eclipses",
  });
}

function EclipseCard({ e, next }: { e: Eclipse; next: boolean }) {
  return (
    <li className={`card p-6 ${next ? "ring-2 ring-blush-deep/50" : ""}`}>
      <p className="eyebrow">{next ? "Next eclipse · " : ""}{e.type === "solar" ? "Solar eclipse · New Moon" : "Lunar eclipse · Full Moon"}</p>
      <h3 className="mt-1 font-display text-2xl text-plum">{e.kind} {e.type} eclipse in <span aria-hidden>{SIGN_INFO[e.sign].glyph}</span> {e.sign}</h3>
      <p className="mt-2">{ukDateTime(e.time)} (peak) · {deg(e)}</p>
      <p className={`mt-2 text-sm ${e.visibleUk ? "text-plum" : "text-muted"}`}>{e.uk}</p>
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

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: `Eclipses ${y} and ${y + 1}`, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl("/eclipses"), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([["Astrology", "/discover"], ["Eclipses", "/eclipses"]]),
        faqLd(ECLIPSE_GUIDE.faqs),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <p className="eyebrow text-blush">Eclipse season</p>
          <h1 className="display-lg mt-3 text-ivory">Eclipses {y} &amp; {y + 1}</h1>
          {next && <p className="mt-5 rounded-2xl bg-ivory/10 p-5 font-display text-2xl leading-snug text-ivory">Next: {next.kind.toLowerCase()} {next.type} eclipse in {next.sign}, {ukDateTime(next.time)}.</p>}
          <p className="mt-5 max-w-2xl text-ivory/85">{ECLIPSE_GUIDE.intro}</p>
          <p className="mt-3 text-sm text-ivory/70">UK times. Visibility is calculated for London.</p>
        </div>
      </section>
      <div className="container-page grid max-w-4xl gap-10 py-12">
        {years.map(({ yr, list }) => (
          <section key={yr} aria-labelledby={`e-${yr}`}>
            <h2 id={`e-${yr}`} className="font-display text-3xl text-plum">Eclipses in {yr}</h2>
            <ol className="mt-4 grid gap-4 sm:grid-cols-2">{list.map((e) => <EclipseCard key={+e.time} e={e} next={e === next} />)}</ol>
          </section>
        ))}

        <section className="card p-6 sm:p-8" aria-labelledby="signs">
          <h2 id="signs" className="font-display text-2xl text-plum sm:text-3xl">What the {nextYear.yr} eclipses mean for your sign</h2>
          <p className="mt-2 text-ink/80">Eclipses come in pairs across two opposite houses of your chart. Read from your Sun sign (or rising sign, if you know it).</p>
          <div className="mt-4 divide-y divide-line">
            {SIGNS.map((s) => {
              const axis = mainAxis(s, nextYear.list.map((e) => e.sign));
              if (!axis) return null;
              const [a, b] = axis.split("-").map(Number);
              const houses = [...new Set(nextYear.list.map((e) => `${e.sign} (${ordinal(solarHouse(s, e.sign))} house)`))];
              return (
                <details key={s} className="group py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-plum [&::-webkit-details-marker]:hidden">
                    <span><span aria-hidden className="mr-2">{SIGN_INFO[s].glyph}</span>{s} · your {ordinal(a)} and {ordinal(b)} houses</span>
                    <span aria-hidden className="text-plum-soft transition group-open:rotate-45">+</span>
                  </summary>
                  <Prose text={ECLIPSE_AXIS[axis]} className="mt-2" />
                  <p className="mt-2 text-sm text-muted">Eclipse signs in {nextYear.yr}: {houses.join(", ")}.</p>
                </details>
              );
            })}
          </div>
        </section>

        {([
          ["What eclipses are", ECLIPSE_GUIDE.whatTheyAre],
          ["Solar eclipses", ECLIPSE_GUIDE.solar],
          ["Lunar eclipses", ECLIPSE_GUIDE.lunar],
          ["Eclipse season", ECLIPSE_GUIDE.season],
          ["Working with eclipse energy", ECLIPSE_GUIDE.work],
        ] as const).map(([t, text], i) => (
          <section key={t} className={i === 4 ? "rounded-[2rem] bg-blush/40 p-6 sm:p-8" : "card p-6 sm:p-8"}>
            <h2 className="font-display text-2xl text-plum sm:text-3xl">{t}</h2>
            <Prose text={text} className="mt-3" />
          </section>
        ))}
        <Faqs items={ECLIPSE_GUIDE.faqs} />
        <p className="text-sm text-muted">Every New and Full Moon is in the <Link href="/moon" className="link-underline">moon calendar</Link>. See also <Link href="/mercury-retrograde" className="link-underline">Mercury retrograde dates</Link>.</p>
      </div>
    </>
  );
}
