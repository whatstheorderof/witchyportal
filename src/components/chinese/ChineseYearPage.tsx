import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ANIMALS, animalSlug, lunarNewYearCached } from "@/lib/astro/chinese";
import { CHINESE_YEARS } from "@/lib/astro/chinese-years";
import { CHINESE_ELEMENT } from "@/lib/astro/text/stars/chinese-year";
import { CHINESE_ANIMALS } from "@/lib/astro/text/stars/chinese-animals";
import { absoluteUrl, breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/stars/Faqs";

const longDate = (d: string) => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));
const day = (d: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

export function chineseYearMetadata(year: number): Metadata {
  const y = CHINESE_YEARS[year];
  if (!y) return { title: "Not found" };
  const name = `${y.element} ${y.animal}`;
  return pageMeta({
    title: `${year} Year of the ${name} — Chinese Zodiac Forecast for Every Animal | Witchy Portal`,
    absoluteTitle: true,
    description: `The ${year} Chinese year of the ${name} begins on ${day(lunarNewYearCached(year))}. What the year brings, and a forecast for all twelve animals from Yulia Moon.`,
    path: `/chinese-zodiac/${year}`,
  });
}

/** A Chinese New Year page for one year. */
export function ChineseYearPage({ year }: { year: number }) {
  const y = CHINESE_YEARS[year];
  if (!y) notFound();
  const start = lunarNewYearCached(year), next = lunarNewYearCached(year + 1);
  const end = new Date(+new Date(`${next}T12:00:00Z`) - 86400000).toISOString().slice(0, 10);
  const name = `${y.element} ${y.animal}`;
  const others = Object.keys(CHINESE_YEARS).map(Number).filter((x) => x !== year);
  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: `${year}: the Year of the ${name}`, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(`/chinese-zodiac/${year}`), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([["Chinese zodiac", "/chinese-zodiac"], [`${year} ${name}`, `/chinese-zodiac/${year}`]]),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-ivory/70"><Link href="/chinese-zodiac" className="hover:text-ivory">Chinese zodiac</Link> <span aria-hidden>/</span> {year}</nav>
          <h1 className="display-lg mt-4 text-ivory">{year}: the Year of the {name}</h1>
          <p className="mt-2 text-ivory/80"><span lang="zh">{y.hanzi}</span> {y.pinyin} · {longDate(start)} – {longDate(end)}</p>
          {others.length > 0 && <p className="mt-4 flex flex-wrap gap-2">{others.map((o) => <Link key={o} href={`/chinese-zodiac/${o}`} className="rounded-full border border-ivory/30 px-4 py-2 text-sm hover:bg-ivory/10">{o}: {CHINESE_YEARS[o].element} {CHINESE_YEARS[o].animal}</Link>)}</p>}
        </div>
      </section>
      <div className="container-page grid max-w-3xl gap-6 py-12">
        <section className="card p-6 sm:p-8"><Prose text={y.text.intro} /></section>
        <section className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum">The {y.element} element</h2><Prose text={CHINESE_ELEMENT[y.element]} className="mt-2" /></section>
        <h2 className="display-md mt-6">{year} for every animal</h2>
        {ANIMALS.map((a) => (
          <section key={a} id={animalSlug(a)} className="card scroll-mt-28 p-6 sm:p-8">
            <h3 className="font-display text-2xl text-plum"><span lang="zh" aria-hidden className="mr-2">{CHINESE_ANIMALS[a].chineseName.split(" ").pop()}</span>{a} in {year}</h3>
            <Prose text={y.text.animals[a]} className="mt-3" />
            <Link href={`/chinese-zodiac/${animalSlug(a)}`} className="mt-3 inline-block text-sm link-underline">All about the {a}</Link>
          </section>
        ))}
      </div>
    </>
  );
}
