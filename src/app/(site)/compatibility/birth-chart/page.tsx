import { breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Section";
import { SynastryTool } from "@/components/stars/SynastryTool";
import { SYNASTRY_PRICE } from "@/lib/astro/compat";

export async function generateMetadata() {
  const { t } = await getReadings();
  return localeMeta({
    title: t("Birth Chart Compatibility Report (Synastry) | Witchy Portal"),
    absoluteTitle: true,
    description: t("Compare two birth charts: love, passion, communication, stability and growth scores, your strongest connections free, and the full synastry report in Yulia's words."),
    path: "/compatibility/birth-chart",
  });
}

export default async function SynastryPage() {
  const { t } = await getReadings();
  return (
    <>
      <JsonLd data={[breadcrumbLd([[t("Compatibility"), "/compatibility"], [t("Birth chart compatibility"), "/compatibility/birth-chart"]])]} />
      <PageHero image="wade" eyebrow={t("Compatibility · full report {price}", { price: SYNASTRY_PRICE.label })} title={t("Birth chart compatibility")} intro={t("Your whole charts, side by side: how your Suns, Moons, Venus and Mars meet, where you light up each other's lives, and what makes your bond work. See your scores and strongest connections free.")} />
      <div className="container-page max-w-5xl py-12 lg:py-16"><SynastryTool /></div>
    </>
  );
}
