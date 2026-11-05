import { getI18n } from "@/i18n/server";
import { localeMeta } from "@/i18n/meta";
import { listPosts } from "@/lib/queries";
import { PageHero, EmptyState } from "@/components/Section";
import { AstrologyCard } from "@/components/PostCards";
import Link from "@/i18n/client";
import { ArrowRight } from "@/components/Icons";
import { RetreatPromo } from "@/components/RetreatPromo";

export async function generateMetadata() {
  const { t } = await getI18n();
  return localeMeta({
    title: t("Astrology forecasts & seasonal wisdom"),
    description: t("Weekly and seasonal astrology from Yulia Moon — what each sign season and moon phase brings, and how to work with it."),
    path: "/astrology",
  });
}

export default async function AstrologyPage() {
  const [posts, { t }] = await Promise.all([listPosts("astrology"), getI18n()]);
  const [first, ...rest] = posts;
  return (
    <>
      <PageHero eyebrow={t("Astrology")} title={t("Wisdom from the sky")} intro={t("Short weekly and seasonal notes on what the planets are stirring — and a gentle ritual to meet it.")}>
        <Link href="/birth-chart" className="btn-outline mt-8">{t("Calculate your birth chart")} <ArrowRight /></Link>
      </PageHero>
      <section className="container-page py-14 lg:py-20">
        {!first ? (
          <EmptyState title={t("The stars are still aligning")} text={t("The first astrology post is on its way.")} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2"><AstrologyCard post={first} featured index={0} /></div>
            {rest.map((p, i) => <AstrologyCard key={p.id} post={p} index={i + 1} />)}
          </div>
        )}
      </section>
      <RetreatPromo eyebrow={t("Written in the stars?")} />
    </>
  );
}
