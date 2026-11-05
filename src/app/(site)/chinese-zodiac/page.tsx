import Link from "@/i18n/client";
import { ANIMALS, FIXED_ELEMENT, animalSlug, lunarNewYearTable, yearsOf } from "@/lib/astro/chinese";
import { CHINESE_ANIMALS } from "@/lib/astro/text/stars/chinese-animals";
import { CHINESE_ELEMENT, CHINESE_INTRO, CHINESE_RELATION } from "@/lib/astro/text/stars/chinese-year";
import { featuredChineseYear } from "@/lib/astro/chinese-years";
import { absoluteUrl, breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ChineseFinder } from "@/components/chinese/ChineseFinder";
import { ChineseCompat } from "@/components/chinese/ChineseCompat";
import { Prose } from "@/components/stars/Faqs";

export const metadata = pageMeta({
  title: "Chinese Zodiac — Find Your Animal, Element and Compatibility | Witchy Portal",
  absoluteTitle: true,
  description: "Find your Chinese zodiac animal and element from your birth date (Lunar New Year included), read all twelve animals, check Chinese zodiac compatibility and read the year ahead for every animal.",
  path: "/chinese-zodiac",
});

export default function ChineseZodiac() {
  const lny = lunarNewYearTable(1900, 2101);
  const fy = featuredChineseYear();
  return (
    <>
      <JsonLd data={[
        breadcrumbLd([["Chinese zodiac", "/chinese-zodiac"]]),
        { "@type": "ItemList", name: "The twelve Chinese zodiac animals", itemListElement: ANIMALS.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a, url: absoluteUrl(`/chinese-zodiac/${animalSlug(a)}`) })) },
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <p className="eyebrow text-blush">Twelve animals, five elements</p>
          <h1 className="display-lg mt-3 text-ivory">Chinese zodiac</h1>
          <p className="mt-4 max-w-2xl text-ivory/85">Find your animal and element from your birth date, meet all twelve animals, and see who you&rsquo;re naturally in tune with.</p>
          <Link href={`/chinese-zodiac/${fy.year}`} className="mt-6 inline-flex rounded-full bg-ivory px-5 py-2.5 text-sm font-medium text-plum hover:bg-blush">{fy.year}: the Year of the {fy.element} {fy.animal} →</Link>
        </div>
      </section>
      <div className="container-page grid max-w-5xl gap-12 py-12">
        <section aria-labelledby="find"><h2 id="find" className="sr-only">Find your animal</h2><ChineseFinder lny={lny} elements={CHINESE_ELEMENT} /></section>
        <section className="card p-6 sm:p-8"><Prose text={CHINESE_INTRO} /></section>
        <section aria-labelledby="animals">
          <h2 id="animals" className="display-md">The twelve animals</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ANIMALS.map((a) => (
              <li key={a}>
                <Link href={`/chinese-zodiac/${animalSlug(a)}`} className="card flex h-full gap-4 p-5 transition hover:-translate-y-0.5">
                  <span aria-hidden lang="zh" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-plum-deep font-display text-2xl text-ivory">{CHINESE_ANIMALS[a].chineseName.split(" ").pop()}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl text-plum">{a}</span>
                    <span className="block text-[0.95rem] text-ink/80">{CHINESE_ANIMALS[a].keywords.slice(0, 3).join(", ")}</span>
                    <span className="mt-1 block text-xs text-muted">{yearsOf(a, 1960, 2031).join(", ")}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">Years shown are when each animal&rsquo;s year began; each starts at Lunar New Year. Fixed elements: {ANIMALS.map((a) => `${a} ${FIXED_ELEMENT[a]}`).join(", ")}.</p>
        </section>
        <section aria-labelledby="compat">
          <h2 id="compat" className="display-md">Chinese zodiac compatibility</h2>
          <p className="mt-2 max-w-2xl text-ink/80">Tradition groups the animals into allies (trines), secret friends, clashes and harm pairs. Choose two animals:</p>
          <div className="mt-6"><ChineseCompat texts={CHINESE_RELATION} /></div>
        </section>
        <section aria-labelledby="elements">
          <h2 id="elements" className="display-md">The five elements</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {(Object.keys(CHINESE_ELEMENT) as (keyof typeof CHINESE_ELEMENT)[]).map((e) => (
              <div key={e} className="card p-6"><h3 className="font-display text-2xl text-plum">{e}</h3><Prose text={CHINESE_ELEMENT[e]} className="mt-2" /></div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
