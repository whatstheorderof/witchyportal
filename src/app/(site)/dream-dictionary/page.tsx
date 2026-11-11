import Link from "@/i18n/client";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { PageHero } from "@/components/Section";
import { Prose } from "@/components/stars/Faqs";
import { DreamSearch } from "@/components/dreams/DreamSearch";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { DREAMS, DREAM_CATEGORIES, DREAM_INTRO, DREAM_NOTE, type DreamCategory } from "@/lib/astro/text/stars/dreams";
import { msg } from "@/i18n/config";

const CATEGORY_LABEL: Record<DreamCategory, string> = { Situations: msg("Situations"), Body: msg("Body"), Animals: msg("Animals"), People: msg("People"), Nature: msg("Nature"), "Places & things": msg("Places & things") };

export async function generateMetadata() {
  const { t } = await getReadings();
  return localeMeta({
    title: t("Dream dictionary: what your dreams mean"),
    description: t("What does it mean to dream of snakes, teeth falling out, water, flying or an ex? A witch's dream dictionary by Yulia Moon, with a reflection question and a small ritual for each dream."),
    path: "/dream-dictionary",
  });
}

export default async function DreamDictionaryPage() {
  const rx = await getReadings();
  const { t } = rx;
  const dreams = rx.deep(DREAMS);
  const items = Object.entries(dreams)
    .map(([slug, d]) => ({ slug, title: d.title, summary: d.summary, keywords: d.keywords, category: DREAMS[slug].category }))
    .sort((a, b) => a.title.localeCompare(b.title, rx.intl));
  return (
    <>
      <JsonLd data={[breadcrumbLd([[t("Dream dictionary"), "/dream-dictionary"]])]} />
      <PageHero image="candleWindow" eyebrow={t("Dream dictionary")} title={t("What your dreams are telling you")} intro={rx("The meaning of common dream symbols, in Yulia's words — with a question to reflect on and a small ritual for each.")} />
      <div className="container-page py-14 lg:py-20">
        <div className="max-w-3xl"><Prose text={rx(DREAM_INTRO)} lang={rx.lang} /></div>
        <div className="mt-12"><DreamSearch items={items} groups={DREAM_CATEGORIES.map((c) => ({ key: c, label: t(CATEGORY_LABEL[c]) }))} /></div>
        <div className="mt-14 grid gap-4 rounded-[2rem] bg-plum-deep p-6 text-ivory sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-display text-3xl">{t("Have a dream you can't shake?")}</p>
            <p className="mt-2 text-ivory/80">{t("Yulia offers personal dream interpretation: tell her the dream and she'll read what it means for you.")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/services" className="btn-light">{t("Dream interpretation")}</Link>
            <Link href="/journal?add=dream" className="btn-outline border-ivory/40 text-ivory hover:bg-ivory/10">{t("Write it in your journal")}</Link>
          </div>
        </div>
        <p lang={rx.lang} className="mt-8 max-w-3xl text-xs text-muted">{rx(DREAM_NOTE)}</p>
      </div>
    </>
  );
}
