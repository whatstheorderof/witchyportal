import Link from "@/i18n/client";
import { ShareImage } from "@/components/ShareImage";
import { notFound } from "next/navigation";
import { ANIMALS, FIXED_ELEMENT, RELATION_LABEL, animalFromSlug, animalSlug, elementOfYear, lunarNewYearCached, relation, yearsOf, type Animal } from "@/lib/astro/chinese";
import { CHINESE_ANIMALS } from "@/lib/astro/text/stars/chinese-animals";
import { CHINESE_RELATION } from "@/lib/astro/text/stars/chinese-year";
import { featuredChineseYear } from "@/lib/astro/chinese-years";
import { absoluteUrl, breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { ChineseCompat } from "@/components/chinese/ChineseCompat";
import { Prose } from "@/components/stars/Faqs";

type Props = { params: Promise<{ animal: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => ANIMALS.map((a) => ({ animal: animalSlug(a) }));

export async function generateMetadata({ params }: Props) {
  const a = animalFromSlug((await params).animal);
  if (!a) return { title: "Not found" };
  const { t } = await getReadings();
  return localeMeta({
    title: t("Year of the {animal}: Chinese Zodiac {animal} Personality, Years and Compatibility | Witchy Portal", { animal: t(a) }),
    absoluteTitle: true,
    description: t("The {animal} in the Chinese zodiac: personality, strengths, love, work, best matches, {animal} years ({years}) and a ritual from Yulia Moon.", { animal: t(a), years: yearsOf(a, 1960, 2031).slice(-4).join(", ") }),
    path: `/chinese-zodiac/${animalSlug(a)}`,
  });
}

const longDate = (d: string, intl: string) => new Intl.DateTimeFormat(intl, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

export default async function AnimalPage({ params }: Props) {
  const a = animalFromSlug((await params).animal);
  if (!a) notFound();
  const rx = await getReadings();
  const { t: tr, intl } = rx, L = rx.lang;
  const t = rx.deep(CHINESE_ANIMALS[a]);
  const A = tr(a);
  const fy = featuredChineseYear();
  const fyName = { element: tr(fy.element), animal: tr(fy.animal) };
  const rels = ANIMALS.filter((b) => b !== a).map((b) => ({ b, r: relation(a, b) }));
  const group = (r: string) => rels.filter((x) => x.r === r).map((x) => x.b);
  const years = yearsOf(a, 1924, 2031);
  const others = ANIMALS.filter((x) => x !== a);
  const partner: Animal = group("secret-friend")[0] ?? group("trine")[0] ?? others[0];

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: tr("The {animal} in the Chinese zodiac", { animal: A }), inLanguage: L, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(`/chinese-zodiac/${animalSlug(a)}`), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([[tr("Chinese zodiac"), "/chinese-zodiac"], [A, `/chinese-zodiac/${animalSlug(a)}`]]),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label={tr("Breadcrumb")} className="text-sm text-ivory/70"><Link href="/chinese-zodiac" className="hover:text-ivory">{tr("Chinese zodiac")}</Link> <span aria-hidden>/</span> {A}</nav>
          <h1 className="display-lg mt-4 text-ivory">{tr("The {animal}", { animal: a === "Goat" ? tr("Goat (Sheep)") : A })}</h1>
          <p className="mt-2 text-ivory/80"><span lang="zh">{t.chineseName}</span> · {tr("fixed element {element}", { element: tr(FIXED_ELEMENT[a]) })} · <span lang={L}>{t.keywords.join(", ")}</span></p>
          <div className="mt-5"><ShareImage query={{ kind: "animal", a }} filename={`chinese-zodiac-${a.toLowerCase()}`} className="btn-light" /></div>
        </div>
      </section>
      <div className="container-page grid max-w-3xl gap-6 py-12">
        <section className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum sm:text-3xl">{tr("The {animal} personality", { animal: A })}</h2><Prose text={t.overview} className="mt-3" lang={L} /></section>
        <div className="grid gap-6 sm:grid-cols-2">
          <section className="card p-6"><h2 className="font-display text-2xl text-plum">{tr("Strengths")}</h2><Prose text={t.strengths} className="mt-2" lang={L} /></section>
          <section className="card p-6"><h2 className="font-display text-2xl text-plum">{tr("Challenges")}</h2><Prose text={t.challenges} className="mt-2" lang={L} /></section>
        </div>
        <section className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum sm:text-3xl">{tr("The {animal} in love", { animal: A })}</h2><Prose text={t.love} className="mt-3" lang={L} /></section>
        <section className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum sm:text-3xl">{tr("The {animal} at work", { animal: A })}</h2><Prose text={t.work} className="mt-3" lang={L} /></section>
        <section className="card p-6 sm:p-8" aria-labelledby="compat">
          <h2 id="compat" className="font-display text-2xl text-plum sm:text-3xl">{tr("{animal} compatibility", { animal: A })}</h2>
          <dl className="mt-4 grid gap-2 text-[0.95rem]">
            {(["trine", "secret-friend", "clash", "harm"] as const).map((r) => group(r).length > 0 && (
              <div key={r} className="grid gap-1 sm:grid-cols-[10rem_1fr]"><dt className="text-muted">{tr(RELATION_LABEL[r])}</dt><dd>{group(r).map((b) => <Link key={b} href={`/chinese-zodiac/${animalSlug(b)}`} className="link-underline me-3">{tr(b)}</Link>)}</dd></div>
            ))}
          </dl>
          <Prose text={t.compatibility} className="mt-4" lang={L} />
          <div className="mt-6"><ChineseCompat texts={rx.deep(CHINESE_RELATION)} initial={[a, partner]} /></div>
        </section>
        <section className="card p-6 sm:p-8" aria-labelledby="years">
          <h2 id="years" className="font-display text-2xl text-plum sm:text-3xl">{tr("{animal} years", { animal: A })}</h2>
          <ul className="mt-3 grid gap-x-6 gap-y-1 text-[0.95rem] sm:grid-cols-2">
            {years.map((y) => <li key={y}>{tr("{element} {animal}", { element: tr(elementOfYear(y)), animal: A })}: {longDate(lunarNewYearCached(y), intl)} – {longDate(new Date(+new Date(`${lunarNewYearCached(y + 1)}T12:00:00Z`) - 86400000).toISOString().slice(0, 10), intl)}</li>)}
          </ul>
          <p className="mt-3 text-sm text-muted">{tr("Each year runs from Lunar New Year to the eve of the next. Not sure?")} <Link href="/chinese-zodiac" className="link-underline">{tr("Find your animal from your birth date")}</Link>.</p>
        </section>
        <section className="card p-6 sm:p-8">
          <p className="eyebrow">{tr("The year ahead")}</p>
          <h2 className="mt-1 font-display text-2xl text-plum sm:text-3xl">{tr("The {animal} in the {year} {element} {yearAnimal} year", { animal: A, year: fy.year, element: fyName.element, yearAnimal: fyName.animal })}</h2>
          <Prose text={rx(fy.text.animals[a])} className="mt-3" lang={L} />
          <Link href={`/chinese-zodiac/${fy.year}`} className="mt-3 inline-block link-underline">{tr("The Year of the {element} {animal}", fyName)}</Link>
        </section>
        <section className="rounded-[2rem] bg-blush/40 p-6 sm:p-8"><p className="eyebrow">{tr("Yulia’s ritual")}</p><h2 className="mt-1 font-display text-2xl text-plum">{tr("A ritual for the {animal}", { animal: A })}</h2><Prose text={t.ritual} className="mt-3" lang={L} /></section>
        <nav aria-label={tr("Other animals")} className="flex flex-wrap gap-2">
          {others.map((x) => <Link key={x} href={`/chinese-zodiac/${animalSlug(x)}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-lavender/40">{tr(x)}</Link>)}
        </nav>
      </div>
    </>
  );
}
