import Link from "@/i18n/client";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { dailyHoroscope, signFromSlug, todayKey } from "@/lib/astro/horoscope";
import { addDays } from "@/lib/astro/sky";
import { featuredYear } from "@/lib/astro/yearly";
import { ZODIAC } from "@/lib/astro/text/zodiac";
import { absoluteUrl, breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { msg } from "@/i18n/config";
import { JsonLd } from "@/components/JsonLd";
import { DayCard } from "@/components/stars/DayCard";
import { RememberSign } from "@/components/stars/RememberSign";

type Props = { params: Promise<{ sign: string }>; searchParams: Promise<{ day?: string }> };
const OFFSETS = { yesterday: -1, today: 0, tomorrow: 1 } as const;
const OFFSET_LABEL = { yesterday: msg("Yesterday"), today: msg("Today"), tomorrow: msg("Tomorrow") } as const;
const longDate = (d: string, intl: string) => new Intl.DateTimeFormat(intl, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

export async function generateMetadata({ params }: Props) {
  const sign = signFromSlug((await params).sign);
  if (!sign) return { title: "Not found" };
  const rx = await getReadings();
  const s = rx.t(sign);
  return localeMeta({
    title: rx.t("{sign} Horoscope Today — Daily {sign} Horoscope | Witchy Portal", { sign: s }),
    absoluteTitle: true,
    description: rx.fill("Your {sign} horoscope for today from Yulia Moon: the Moon's journey through your chart, love, work and energy ratings, and a small ritual for the day. Updated every day.", { sign: s }),
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
  const rx = await getReadings();
  const t = rx.t, name = t(sign);
  const h = dailyHoroscope(sign, day, rx);
  const i = SIGNS.indexOf(sign);
  const others = SIGNS.filter((s) => s !== sign);

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: t("{sign} horoscope for {date}", { sign: name, date: longDate(day, rx.intl) }), datePublished: `${day}T00:00:00Z`, dateModified: `${day}T00:00:00Z`, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(`/horoscope/${sign.toLowerCase()}`), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([[t("Horoscopes"), "/horoscope"], [t("{sign} horoscope", { sign: name }), `/horoscope/${sign.toLowerCase()}`]]),
      ]} />
      <RememberSign sign={sign} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32 lg:pb-20">
        <div className="container-page max-w-3xl">
          <nav aria-label={t("Breadcrumb")} className="text-sm text-ivory/70"><Link href="/horoscope" className="hover:text-ivory">{t("Horoscopes")}</Link> <span aria-hidden>/</span> {name}</nav>
          <h1 className="display-lg mt-4 text-ivory"><span aria-hidden className="me-3">{SIGN_INFO[sign].glyph}</span>{t("{sign} horoscope", { sign: name })}</h1>
          <p className="mt-2 text-ivory/80">{rx(ZODIAC[sign].dates)} · {longDate(day, rx.intl)}</p>
          <nav aria-label={t("Choose a day")} className="mt-6 flex flex-wrap gap-2">
            {(Object.keys(OFFSETS) as (keyof typeof OFFSETS)[]).map((k) => (
              <Link key={k} href={k === "today" ? `/horoscope/${sign.toLowerCase()}` : `?day=${k}`} aria-current={OFFSETS[k] === offset ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm capitalize ${OFFSETS[k] === offset ? "bg-ivory text-plum" : "border border-ivory/30 text-ivory hover:bg-ivory/10"}`}>{t(OFFSET_LABEL[k])}</Link>
            ))}
            <Link href={`/horoscope/${sign.toLowerCase()}/monthly`} className="rounded-full border border-ivory/30 px-4 py-2 text-sm text-ivory hover:bg-ivory/10">{t("This month")}</Link>
            <Link href={`/horoscope/${sign.toLowerCase()}/${featuredYear()}`} className="rounded-full border border-ivory/30 px-4 py-2 text-sm text-ivory hover:bg-ivory/10">{t("Your {year}", { year: featuredYear() })}</Link>
          </nav>
          <div className="mt-10 rounded-[2rem] bg-ivory/5 p-6 ring-1 ring-ivory/10 sm:p-10">
            <DayCard h={h} light />
          </div>
          <p className="mt-4 text-xs text-ivory/60">{t("Read from your Sun sign using today’s real sky (UK time). If you know your rising sign, read that one too.")}</p>
        </div>
      </section>

      <section className="container-page grid gap-8 py-14 lg:grid-cols-3">
        <Link href={`/zodiac/${sign.toLowerCase()}`} className="card p-6"><p className="eyebrow">{t("Your sign")}</p><p className="mt-1 font-display text-2xl text-plum">{t("All about {sign}", { sign: name })}</p><p className="text-sm text-muted">{t("Traits, love, work and self-care.")}</p></Link>
        <Link href={`/compatibility/${sign.toLowerCase()}-and-${SIGNS[(i + 4) % 12].toLowerCase()}`} className="card p-6"><p className="eyebrow">{t("Compatibility")}</p><p className="mt-1 font-display text-2xl text-plum">{t("{sign} in love", { sign: name })}</p><p className="text-sm text-muted">{t("Test your signs together.")}</p></Link>
        <Link href="/birth-chart" className="card p-6"><p className="eyebrow">{t("Go deeper")}</p><p className="mt-1 font-display text-2xl text-plum">{t("Your full birth chart")}</p><p className="text-sm text-muted">{t("Free natal chart and written report.")}</p></Link>
      </section>
      <nav aria-label={t("Other signs")} className="container-page pb-16">
        <h2 className="font-display text-2xl text-plum">{t("Other signs today")}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">{others.map((s) => <li key={s}><Link href={`/horoscope/${s.toLowerCase()}`} className="chip"><span aria-hidden className="me-1">{SIGN_INFO[s].glyph}</span>{t(s)}</Link></li>)}</ul>
      </nav>
    </>
  );
}
