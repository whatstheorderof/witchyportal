import Link from "@/i18n/client";
import { notFound } from "next/navigation";
import { ANIMALS, animalSlug, lunarNewYearCached } from "@/lib/astro/chinese";
import { CHINESE_YEARS } from "@/lib/astro/chinese-years";
import { CHINESE_ELEMENT } from "@/lib/astro/text/stars/chinese-year";
import { CHINESE_ANIMALS } from "@/lib/astro/text/stars/chinese-animals";
import { absoluteUrl, breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/stars/Faqs";

const longDate = (d: string, intl: string) => new Intl.DateTimeFormat(intl, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));
const day = (d: string, intl: string) => new Intl.DateTimeFormat(intl, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

export async function chineseYearMetadata(year: number) {
  const y = CHINESE_YEARS[year];
  if (!y) return { title: "Not found" };
  const { t, intl } = await getReadings();
  const v = { year, element: t(y.element), animal: t(y.animal) };
  return localeMeta({
    title: t("{year} Year of the {element} {animal} — Chinese Zodiac Forecast for Every Animal | Witchy Portal", v),
    absoluteTitle: true,
    description: t("The {year} Chinese year of the {element} {animal} begins on {date}. What the year brings, and a forecast for all twelve animals from Yulia Moon.", { ...v, date: day(lunarNewYearCached(year), intl) }),
    path: `/chinese-zodiac/${year}`,
  });
}

/** A Chinese New Year page for one year. */
export async function ChineseYearPage({ year }: { year: number }) {
  const y = CHINESE_YEARS[year];
  if (!y) notFound();
  const rx = await getReadings();
  const { t, intl } = rx, L = rx.lang;
  const yearName = (x: { element: string; animal: string }) => t("the Year of the {element} {animal}", { element: t(x.element), animal: t(x.animal) });
  const start = lunarNewYearCached(year), next = lunarNewYearCached(year + 1);
  const end = new Date(+new Date(`${next}T12:00:00Z`) - 86400000).toISOString().slice(0, 10);
  const name = t("{element} {animal}", { element: t(y.element), animal: t(y.animal) });
  const others = Object.keys(CHINESE_YEARS).map(Number).filter((x) => x !== year);
  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: `${year}: ${yearName(y)}`, inLanguage: L, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(`/chinese-zodiac/${year}`), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([[t("Chinese zodiac"), "/chinese-zodiac"], [`${year} ${name}`, `/chinese-zodiac/${year}`]]),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label={t("Breadcrumb")} className="text-sm text-ivory/70"><Link href="/chinese-zodiac" className="hover:text-ivory">{t("Chinese zodiac")}</Link> <span aria-hidden>/</span> {year}</nav>
          <h1 className="display-lg mt-4 text-ivory">{year}: {yearName(y)}</h1>
          <p className="mt-2 text-ivory/80"><span lang="zh">{y.hanzi}</span> {y.pinyin} · {longDate(start, intl)} – {longDate(end, intl)}</p>
          {others.length > 0 && <p className="mt-4 flex flex-wrap gap-2">{others.map((o) => <Link key={o} href={`/chinese-zodiac/${o}`} className="rounded-full border border-ivory/30 px-4 py-2 text-sm hover:bg-ivory/10">{o}: {t("{element} {animal}", { element: t(CHINESE_YEARS[o].element), animal: t(CHINESE_YEARS[o].animal) })}</Link>)}</p>}
        </div>
      </section>
      <div className="container-page grid max-w-3xl gap-6 py-12">
        <section className="card p-6 sm:p-8"><Prose text={rx(y.text.intro)} lang={L} /></section>
        <section className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum">{t("The {element} element", { element: t(y.element) })}</h2><Prose text={rx(CHINESE_ELEMENT[y.element])} className="mt-2" lang={L} /></section>
        <h2 className="display-md mt-6">{t("{year} for every animal", { year })}</h2>
        {ANIMALS.map((a) => (
          <section key={a} id={animalSlug(a)} className="card scroll-mt-28 p-6 sm:p-8">
            <h3 className="font-display text-2xl text-plum"><span lang="zh" aria-hidden className="me-2">{CHINESE_ANIMALS[a].chineseName.split(" ").pop()}</span>{t("{animal} in {year}", { animal: t(a), year })}</h3>
            <Prose text={rx(y.text.animals[a])} className="mt-3" lang={L} />
            <Link href={`/chinese-zodiac/${animalSlug(a)}`} className="mt-3 inline-block text-sm link-underline">{t("All about the {animal}", { animal: t(a) })}</Link>
          </section>
        ))}
      </div>
    </>
  );
}
