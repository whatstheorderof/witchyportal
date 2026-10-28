import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { dailyHoroscope, signFromSlug, todayKey } from "@/lib/astro/horoscope";
import { addDays } from "@/lib/astro/sky";
import { ZODIAC } from "@/lib/astro/text/zodiac";
import { absoluteUrl, breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { DayCard } from "@/components/stars/DayCard";
import { RememberSign } from "@/components/stars/RememberSign";

type Props = { params: Promise<{ sign: string }>; searchParams: Promise<{ day?: string }> };
const OFFSETS = { yesterday: -1, today: 0, tomorrow: 1 } as const;
const longDate = (d: string) => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sign = signFromSlug((await params).sign);
  if (!sign) return { title: "Not found" };
  return pageMeta({
    title: `${sign} Horoscope Today — Daily ${sign} Horoscope | Witchy Portal`,
    absoluteTitle: true,
    description: `Your ${sign} horoscope for today from Yulia Moon: the Moon's journey through your chart, love, work and energy ratings, and a small ritual for the day. Updated every day.`,
    path: `/horoscope/${sign.toLowerCase()}`,
  });
}

export default async function SignHoroscope({ params, searchParams }: Props) {
  const sign = signFromSlug((await params).sign);
  if (!sign) notFound();
  await connection();
  const which = ((await searchParams).day ?? "today") as keyof typeof OFFSETS;
  const offset = OFFSETS[which] ?? 0;
  const day = addDays(todayKey(), offset);
  const h = dailyHoroscope(sign, day);
  const i = SIGNS.indexOf(sign);
  const others = SIGNS.filter((s) => s !== sign);

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: `${sign} horoscope for ${longDate(day)}`, datePublished: `${day}T00:00:00Z`, dateModified: `${day}T00:00:00Z`, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(`/horoscope/${sign.toLowerCase()}`), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([["Horoscopes", "/horoscope"], [`${sign} horoscope`, `/horoscope/${sign.toLowerCase()}`]]),
      ]} />
      <RememberSign sign={sign} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32 lg:pb-20">
        <div className="container-page max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-ivory/70"><Link href="/horoscope" className="hover:text-ivory">Horoscopes</Link> <span aria-hidden>/</span> {sign}</nav>
          <h1 className="display-lg mt-4 text-ivory"><span aria-hidden className="mr-3">{SIGN_INFO[sign].glyph}</span>{sign} horoscope</h1>
          <p className="mt-2 text-ivory/80">{ZODIAC[sign].dates} · {longDate(day)}</p>
          <nav aria-label="Choose a day" className="mt-6 flex flex-wrap gap-2">
            {(Object.keys(OFFSETS) as (keyof typeof OFFSETS)[]).map((k) => (
              <Link key={k} href={k === "today" ? `/horoscope/${sign.toLowerCase()}` : `?day=${k}`} aria-current={OFFSETS[k] === offset ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm capitalize ${OFFSETS[k] === offset ? "bg-ivory text-plum" : "border border-ivory/30 text-ivory hover:bg-ivory/10"}`}>{k}</Link>
            ))}
            <Link href={`/horoscope/${sign.toLowerCase()}/monthly`} className="rounded-full border border-ivory/30 px-4 py-2 text-sm text-ivory hover:bg-ivory/10">This month</Link>
          </nav>
          <div className="mt-10 rounded-[2rem] bg-ivory/5 p-6 ring-1 ring-ivory/10 sm:p-10">
            <DayCard h={h} light />
          </div>
          <p className="mt-4 text-xs text-ivory/60">Read from your Sun sign using today&rsquo;s real sky (UK time). If you know your rising sign, read that one too.</p>
        </div>
      </section>

      <section className="container-page grid gap-8 py-14 lg:grid-cols-3">
        <Link href={`/zodiac/${sign.toLowerCase()}`} className="card p-6"><p className="eyebrow">Your sign</p><p className="mt-1 font-display text-2xl text-plum">All about {sign}</p><p className="text-sm text-muted">Traits, love, work and self-care.</p></Link>
        <Link href={`/compatibility/${sign.toLowerCase()}-and-${SIGNS[(i + 4) % 12].toLowerCase()}`} className="card p-6"><p className="eyebrow">Compatibility</p><p className="mt-1 font-display text-2xl text-plum">{sign} in love</p><p className="text-sm text-muted">Test your signs together.</p></Link>
        <Link href="/birth-chart" className="card p-6"><p className="eyebrow">Go deeper</p><p className="mt-1 font-display text-2xl text-plum">Your full birth chart</p><p className="text-sm text-muted">Free natal chart and written report.</p></Link>
      </section>
      <nav aria-label="Other signs" className="container-page pb-16">
        <h2 className="font-display text-2xl text-plum">Other signs today</h2>
        <ul className="mt-4 flex flex-wrap gap-2">{others.map((s) => <li key={s}><Link href={`/horoscope/${s.toLowerCase()}`} className="chip"><span aria-hidden className="mr-1">{SIGN_INFO[s].glyph}</span>{s}</Link></li>)}</ul>
      </nav>
    </>
  );
}
