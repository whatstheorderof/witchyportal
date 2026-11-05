import Link from "@/i18n/client";
import { ANIMALS, FIXED_ELEMENT, animalSlug, lunarNewYearTable, yearsOf } from "@/lib/astro/chinese";
import { CHINESE_ANIMALS } from "@/lib/astro/text/stars/chinese-animals";
import { CHINESE_ELEMENT, CHINESE_INTRO, CHINESE_RELATION } from "@/lib/astro/text/stars/chinese-year";
import { featuredChineseYear } from "@/lib/astro/chinese-years";
import { absoluteUrl, breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { ChineseFinder } from "@/components/chinese/ChineseFinder";
import { ChineseCompat } from "@/components/chinese/ChineseCompat";
import { Prose } from "@/components/stars/Faqs";

export async function generateMetadata() {
  const { t } = await getReadings();
  return localeMeta({
    title: t("Chinese Zodiac — Find Your Animal, Element and Compatibility | Witchy Portal"),
    absoluteTitle: true,
    description: t("Find your Chinese zodiac animal and element from your birth date (Lunar New Year included), read all twelve animals, check Chinese zodiac compatibility and read the year ahead for every animal."),
    path: "/chinese-zodiac",
  });
}

export default async function ChineseZodiac() {
  const lny = lunarNewYearTable(1900, 2101);
  const fy = featuredChineseYear();
  const rx = await getReadings();
  const t = rx.t;
  const elements = rx.deep(CHINESE_ELEMENT);
  return (
    <>
      <JsonLd data={[
        breadcrumbLd([[t("Chinese zodiac"), "/chinese-zodiac"]]),
        { "@type": "ItemList", name: t("The twelve Chinese zodiac animals"), itemListElement: ANIMALS.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: t(a), url: absoluteUrl(`/chinese-zodiac/${animalSlug(a)}`) })) },
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <p className="eyebrow text-blush">{t("Twelve animals, five elements")}</p>
          <h1 className="display-lg mt-3 text-ivory">{t("Chinese zodiac")}</h1>
          <p className="mt-4 max-w-2xl text-ivory/85">{t("Find your animal and element from your birth date, meet all twelve animals, and see who you’re naturally in tune with.")}</p>
          <Link href={`/chinese-zodiac/${fy.year}`} className="mt-6 inline-flex rounded-full bg-ivory px-5 py-2.5 text-sm font-medium text-plum hover:bg-blush">{t("{year}: the Year of the {element} {animal}", { year: fy.year, element: t(fy.element), animal: t(fy.animal) })} <span aria-hidden className="ms-1 inline-block rtl:-scale-x-100">→</span></Link>
        </div>
      </section>
      <div className="container-page grid max-w-5xl gap-12 py-12">
        <section aria-labelledby="find"><h2 id="find" className="sr-only">{t("Find your animal")}</h2><ChineseFinder lny={lny} elements={elements} /></section>
        <section className="card p-6 sm:p-8"><Prose text={rx(CHINESE_INTRO)} lang={rx.lang} /></section>
        <section aria-labelledby="animals">
          <h2 id="animals" className="display-md">{t("The twelve animals")}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ANIMALS.map((a) => (
              <li key={a}>
                <Link href={`/chinese-zodiac/${animalSlug(a)}`} className="card flex h-full gap-4 p-5 transition hover:-translate-y-0.5">
                  <span aria-hidden lang="zh" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-plum-deep font-display text-2xl text-ivory">{CHINESE_ANIMALS[a].chineseName.split(" ").pop()}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl text-plum">{t(a)}</span>
                    <span lang={rx.lang} className="block text-[0.95rem] text-ink/80">{rx.deep(CHINESE_ANIMALS[a].keywords).slice(0, 3).join(", ")}</span>
                    <span className="mt-1 block text-xs text-muted">{yearsOf(a, 1960, 2031).join(", ")}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">{t("Years shown are when each animal’s year began; each starts at Lunar New Year.")} {t("Fixed elements: {list}.", { list: ANIMALS.map((a) => `${t(a)} ${t(FIXED_ELEMENT[a])}`).join(", ") })}</p>
        </section>
        <section aria-labelledby="compat">
          <h2 id="compat" className="display-md">{t("Chinese zodiac compatibility")}</h2>
          <p className="mt-2 max-w-2xl text-ink/80">{t("Tradition groups the animals into allies (trines), secret friends, clashes and harm pairs. Choose two animals:")}</p>
          <div className="mt-6"><ChineseCompat texts={rx.deep(CHINESE_RELATION)} /></div>
        </section>
        <section aria-labelledby="elements">
          <h2 id="elements" className="display-md">{t("The five elements")}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {(Object.keys(CHINESE_ELEMENT) as (keyof typeof CHINESE_ELEMENT)[]).map((e) => (
              <div key={e} className="card p-6"><h3 className="font-display text-2xl text-plum">{t(e)}</h3><Prose text={elements[e]} className="mt-2" lang={rx.lang} /></div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
