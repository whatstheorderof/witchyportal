import Link from "next/link";
import { ANIMALS, animalSlug, lunarNewYearCached } from "@/lib/astro/chinese";
import { CHINESE_YEAR_2027, CHINESE_ELEMENT } from "@/lib/astro/text/stars/chinese-year";
import { CHINESE_ANIMALS } from "@/lib/astro/text/stars/chinese-animals";
import { absoluteUrl, breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/stars/Faqs";

export const metadata = pageMeta({
  title: "2027 Year of the Fire Goat — Chinese Zodiac Forecast for Every Animal | Witchy Portal",
  absoluteTitle: true,
  description: "The 2027 Chinese year of the Fire Goat begins on 6 February 2027. What the year brings, and a forecast for all twelve animals from Yulia Moon.",
  path: "/chinese-zodiac/2027",
});

const longDate = (d: string) => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

export default function FireGoat() {
  const start = lunarNewYearCached(2027), next = lunarNewYearCached(2028);
  const end = new Date(+new Date(`${next}T12:00:00Z`) - 86400000).toISOString().slice(0, 10);
  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: "2027: the Year of the Fire Goat", author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl("/chinese-zodiac/2027"), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([["Chinese zodiac", "/chinese-zodiac"], ["2027 Fire Goat", "/chinese-zodiac/2027"]]),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-ivory/70"><Link href="/chinese-zodiac" className="hover:text-ivory">Chinese zodiac</Link> <span aria-hidden>/</span> 2027</nav>
          <h1 className="display-lg mt-4 text-ivory">2027: the Year of the Fire Goat</h1>
          <p className="mt-2 text-ivory/80"><span lang="zh">丁未</span> Dīng Wèi · {longDate(start)} – {longDate(end)}</p>
        </div>
      </section>
      <div className="container-page grid max-w-3xl gap-6 py-12">
        <section className="card p-6 sm:p-8"><Prose text={CHINESE_YEAR_2027.intro} /></section>
        <section className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum">The Fire element</h2><Prose text={CHINESE_ELEMENT.Fire} className="mt-2" /></section>
        <h2 className="display-md mt-6">2027 for every animal</h2>
        {ANIMALS.map((a) => (
          <section key={a} id={animalSlug(a)} className="card scroll-mt-28 p-6 sm:p-8">
            <h3 className="font-display text-2xl text-plum"><span lang="zh" aria-hidden className="mr-2">{CHINESE_ANIMALS[a].chineseName.split(" ").pop()}</span>{a} in 2027</h3>
            <Prose text={CHINESE_YEAR_2027.animals[a]} className="mt-3" />
            <Link href={`/chinese-zodiac/${animalSlug(a)}`} className="mt-3 inline-block text-sm link-underline">All about the {a}</Link>
          </section>
        ))}
      </div>
    </>
  );
}
