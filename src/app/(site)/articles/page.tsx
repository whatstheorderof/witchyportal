import { getI18n } from "@/i18n/server";
import { localeMeta } from "@/i18n/meta";
import { listPosts, listTopics } from "@/lib/queries";
import { PageHero, EmptyState } from "@/components/Section";
import { ArticleCard } from "@/components/PostCards";
import { TopicFilter } from "@/components/TopicFilter";
import { RetreatPromo } from "@/components/RetreatPromo";

export async function generateMetadata() {
  const { t } = await getI18n();
  return localeMeta({
    title: t("Witchy articles"),
    description: t("Short articles from Yulia Moon on ritual, tarot, astrology, dreams and living by the moon."),
    path: "/articles",
  });
}

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  const [posts, topics, { t, tc }] = await Promise.all([listPosts("article", { topic }), listTopics("article"), getI18n()]);
  return (
    <>
      <PageHero eyebrow={t("Articles")} title={t("Short reads for slow moments")} intro={t("Concise articles to read with a cup of tea.")}>
        <TopicFilter base="/articles" topics={topics} active={topic} />
      </PageHero>
      <section className="container-page py-14 lg:py-20">
        {posts.length === 0 ? (
          <EmptyState title={t("No articles yet")} text={topic ? t("Nothing about “{topic}” yet.", { topic: tc(topic) }) : t("The first articles are being written.")} />
        ) : (
          <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">{posts.map((p, i) => <ArticleCard key={p.id} post={p} index={i} />)}</div>
        )}
      </section>
      <RetreatPromo />
    </>
  );
}
