import { breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Section";
import { LoveCompat } from "@/components/stars/LoveCompat";

export async function generateMetadata() {
  const { t } = await getReadings();
  return localeMeta({
    title: t("Love Sign Compatibility: Compare Your Venus Signs | Witchy Portal"),
    absoluteTitle: true,
    description: t("Free love sign compatibility: enter two birth dates to find both Venus signs and see how your love styles, affection and attraction meet — with Yulia's advice."),
    path: "/compatibility/love",
  });
}

export default async function LovePage() {
  const { t } = await getReadings();
  return (
    <>
      <JsonLd data={[breadcrumbLd([[t("Compatibility"), "/compatibility"], [t("Love signs"), "/compatibility/love"]])]} />
      <PageHero image="red" eyebrow={t("Compatibility")} title={t("Love sign compatibility")} intro={t("Your Venus sign is your love sign: how you flirt, show affection and feel cherished. Enter two birth dates and see how your love styles meet.")} />
      <div className="container-page max-w-4xl py-12 lg:py-16"><LoveCompat /></div>
    </>
  );
}
