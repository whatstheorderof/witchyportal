import { getI18n } from "@/i18n/server";
import { localeMeta } from "@/i18n/meta";
import { msg } from "@/i18n/config";
import { listPosts } from "@/lib/queries";
import { PageHero, EmptyState } from "@/components/Section";
import { TipCard } from "@/components/PostCards";
import { TopicFilter } from "@/components/TopicFilter";
import { RetreatPromo } from "@/components/RetreatPromo";

export async function generateMetadata() {
  const { t } = await getI18n();
  return localeMeta({
    title: t("Witchy tips, affirmations & motivations"),
    description: t("Short witchy tips, affirmations and motivations from Yulia Moon — simple spells, rituals and words to carry with you, filtered by topic."),
    path: "/tips",
  });
}

type Props = { searchParams: Promise<{ topic?: string; kind?: string }> };

export default async function TipsPage({ searchParams }: Props) {
  const { topic, kind } = await searchParams;
  const [tips, affirmations, motivations, { t, tc }] = await Promise.all([listPosts("tip"), listPosts("affirmation"), listPosts("motivation"), getI18n()]);
  const all = [...tips, ...affirmations, ...motivations].sort((a, b) => +(b.publishAt ?? b.createdAt) - +(a.publishAt ?? a.createdAt));
  const topics = [...new Set(all.map((p) => p.topic).filter(Boolean))].sort();
  const filtered = all.filter((p) => (!topic || p.topic === topic) && (!kind || p.type === kind));
  return (
    <>
      <PageHero eyebrow={t("Witchy tips")} title={t("Tips, affirmations & motivation")} intro={t("Small, doable magic for busy days. Filter by topic to find what you need right now.")}>
        <TopicFilter base="/tips" topics={topics} active={topic} extra={[{ label: t(msg("Affirmations")), value: "affirmation", param: "kind", active: kind === "affirmation" }, { label: t(msg("Motivation")), value: "motivation", param: "kind", active: kind === "motivation" }, { label: t(msg("Tips")), value: "tip", param: "kind", active: kind === "tip" }]} />
      </PageHero>
      <section className="container-page py-14 lg:py-20">
        {filtered.length === 0 ? (
          <EmptyState title={t("Nothing here yet")} text={topic ? t("No tips about “{topic}” yet — try another topic.", { topic: tc(topic) }) : t("New tips are on their way. Check back soon.")} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((p, i) => <TipCard key={p.id} post={p} index={i} />)}</div>
        )}
      </section>
      <RetreatPromo eyebrow={t("From tips to transformation")} />
    </>
  );
}
