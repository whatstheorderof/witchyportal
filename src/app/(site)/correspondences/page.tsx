import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { PageHero } from "@/components/Section";
import { Prose } from "@/components/stars/Faqs";
import { JsonLd } from "@/components/JsonLd";
import { CorrFinder } from "@/components/correspondences/CorrFinder";
import { breadcrumbLd } from "@/lib/seo";
import { CORRESPONDENCES, CORR_INTRO, CORR_NOTE, INTENTIONS, KIND_LABEL, type CorrKind } from "@/lib/astro/text/stars/correspondences";

export async function generateMetadata() {
  const { t } = await getReadings();
  return localeMeta({
    title: t("Magic correspondences: crystals, herbs and candle colours"),
    description: t("Crystal meanings, magical herbs and candle colour meanings for love, protection, money, calm and intuition — with how Yulia Moon uses each one in her rituals."),
    path: "/correspondences",
  });
}

const KINDS: CorrKind[] = ["crystal", "herb", "candle"];

export default async function CorrespondencesPage() {
  const rx = await getReadings();
  const { t } = rx;
  const all = rx.deep(CORRESPONDENCES);
  const items = Object.entries(all)
    .map(([slug, c]) => ({ slug, kind: c.kind, name: t(CORRESPONDENCES[slug].name), summary: c.summary, keywords: c.keywords, intentions: c.intentions }))
    .sort((a, b) => a.name.localeCompare(b.name, rx.intl));
  return (
    <>
      <JsonLd data={[breadcrumbLd([[t("Correspondences"), "/correspondences"]])]} />
      <PageHero image="redCandles" eyebrow={t("Correspondences")} title={t("Crystals, herbs and candle colours")} intro={t("What each one is traditionally used for, and how Yulia works with it. Choose what you need and build your own little ritual.")} />
      <div className="container-page py-14 lg:py-20">
        <div className="max-w-3xl"><Prose text={rx(CORR_INTRO)} lang={rx.lang} /></div>
        <div className="mt-12">
          <CorrFinder items={items} kinds={KINDS.map((k) => ({ key: k, label: t(KIND_LABEL[k].many) }))} intentions={INTENTIONS.map((i) => ({ key: i.key, label: t(i.label) }))} />
        </div>
        <p lang={rx.lang} className="mt-12 max-w-3xl text-xs text-muted">{rx(CORR_NOTE)}</p>
      </div>
    </>
  );
}
