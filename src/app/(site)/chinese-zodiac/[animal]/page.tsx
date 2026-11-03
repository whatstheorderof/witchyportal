import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ANIMALS, FIXED_ELEMENT, RELATION_LABEL, animalFromSlug, animalSlug, elementOfYear, lunarNewYearCached, relation, yearsOf, type Animal } from "@/lib/astro/chinese";
import { CHINESE_ANIMALS } from "@/lib/astro/text/stars/chinese-animals";
import { CHINESE_RELATION } from "@/lib/astro/text/stars/chinese-year";
import { featuredChineseYear } from "@/lib/astro/chinese-years";
import { absoluteUrl, breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ChineseCompat } from "@/components/chinese/ChineseCompat";
import { Prose } from "@/components/stars/Faqs";

type Props = { params: Promise<{ animal: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => ANIMALS.map((a) => ({ animal: animalSlug(a) }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = animalFromSlug((await params).animal);
  if (!a) return { title: "Not found" };
  return pageMeta({
    title: `Year of the ${a}: Chinese Zodiac ${a} Personality, Years and Compatibility | Witchy Portal`,
    absoluteTitle: true,
    description: `The ${a} in the Chinese zodiac: personality, strengths, love, work, best matches, ${a} years (${yearsOf(a, 1960, 2031).slice(-4).join(", ")}) and a ritual from Yulia Moon.`,
    path: `/chinese-zodiac/${animalSlug(a)}`,
  });
}

const longDate = (d: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

export default async function AnimalPage({ params }: Props) {
  const a = animalFromSlug((await params).animal);
  if (!a) notFound();
  const t = CHINESE_ANIMALS[a];
  const fy = featuredChineseYear();
  const rels = ANIMALS.filter((b) => b !== a).map((b) => ({ b, r: relation(a, b) }));
  const group = (r: string) => rels.filter((x) => x.r === r).map((x) => x.b);
  const years = yearsOf(a, 1924, 2031);
  const others = ANIMALS.filter((x) => x !== a);
  const partner: Animal = group("secret-friend")[0] ?? group("trine")[0] ?? others[0];

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: `The ${a} in the Chinese zodiac`, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(`/chinese-zodiac/${animalSlug(a)}`), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([["Chinese zodiac", "/chinese-zodiac"], [a, `/chinese-zodiac/${animalSlug(a)}`]]),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-ivory/70"><Link href="/chinese-zodiac" className="hover:text-ivory">Chinese zodiac</Link> <span aria-hidden>/</span> {a}</nav>
          <h1 className="display-lg mt-4 text-ivory">The {a}{a === "Goat" ? " (Sheep)" : ""}</h1>
          <p className="mt-2 text-ivory/80"><span lang="zh">{t.chineseName}</span> · fixed element {FIXED_ELEMENT[a]} · {t.keywords.join(", ")}</p>
        </div>
      </section>
      <div className="container-page grid max-w-3xl gap-6 py-12">
        <section className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum sm:text-3xl">The {a} personality</h2><Prose text={t.overview} className="mt-3" /></section>
        <div className="grid gap-6 sm:grid-cols-2">
          <section className="card p-6"><h2 className="font-display text-2xl text-plum">Strengths</h2><Prose text={t.strengths} className="mt-2" /></section>
          <section className="card p-6"><h2 className="font-display text-2xl text-plum">Challenges</h2><Prose text={t.challenges} className="mt-2" /></section>
        </div>
        <section className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum sm:text-3xl">The {a} in love</h2><Prose text={t.love} className="mt-3" /></section>
        <section className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum sm:text-3xl">The {a} at work</h2><Prose text={t.work} className="mt-3" /></section>
        <section className="card p-6 sm:p-8" aria-labelledby="compat">
          <h2 id="compat" className="font-display text-2xl text-plum sm:text-3xl">{a} compatibility</h2>
          <dl className="mt-4 grid gap-2 text-[0.95rem]">
            {(["trine", "secret-friend", "clash", "harm"] as const).map((r) => group(r).length > 0 && (
              <div key={r} className="grid gap-1 sm:grid-cols-[10rem_1fr]"><dt className="text-muted">{RELATION_LABEL[r]}</dt><dd>{group(r).map((b) => <Link key={b} href={`/chinese-zodiac/${animalSlug(b)}`} className="link-underline mr-3">{b}</Link>)}</dd></div>
            ))}
          </dl>
          <Prose text={t.compatibility} className="mt-4" />
          <div className="mt-6"><ChineseCompat texts={CHINESE_RELATION} initial={[a, partner]} /></div>
        </section>
        <section className="card p-6 sm:p-8" aria-labelledby="years">
          <h2 id="years" className="font-display text-2xl text-plum sm:text-3xl">{a} years</h2>
          <ul className="mt-3 grid gap-x-6 gap-y-1 text-[0.95rem] sm:grid-cols-2">
            {years.map((y) => <li key={y}>{elementOfYear(y)} {a}: {longDate(lunarNewYearCached(y))} – {longDate(new Date(+new Date(`${lunarNewYearCached(y + 1)}T12:00:00Z`) - 86400000).toISOString().slice(0, 10))}</li>)}
          </ul>
          <p className="mt-3 text-sm text-muted">Each year runs from Lunar New Year to the eve of the next. Not sure? <Link href="/chinese-zodiac" className="link-underline">Find your animal from your birth date</Link>.</p>
        </section>
        <section className="card p-6 sm:p-8">
          <p className="eyebrow">The year ahead</p>
          <h2 className="mt-1 font-display text-2xl text-plum sm:text-3xl">The {a} in the {fy.year} {fy.element} {fy.animal} year</h2>
          <Prose text={fy.text.animals[a]} className="mt-3" />
          <Link href={`/chinese-zodiac/${fy.year}`} className="mt-3 inline-block link-underline">The Year of the {fy.element} {fy.animal}</Link>
        </section>
        <section className="rounded-[2rem] bg-blush/40 p-6 sm:p-8"><p className="eyebrow">Yulia&rsquo;s ritual</p><h2 className="mt-1 font-display text-2xl text-plum">A ritual for the {a}</h2><Prose text={t.ritual} className="mt-3" /></section>
        <nav aria-label="Other animals" className="flex flex-wrap gap-2">
          {others.map((x) => <Link key={x} href={`/chinese-zodiac/${animalSlug(x)}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-lavender/40">{x}</Link>)}
        </nav>
      </div>
    </>
  );
}
