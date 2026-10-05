import type { Metadata } from "next";
import { listPosts, listTopics } from "@/lib/queries";
import { PageHero, EmptyState } from "@/components/Section";
import { ArticleCard } from "@/components/PostCards";
import { TopicFilter } from "@/components/TopicFilter";
import { RetreatPromo } from "@/components/RetreatPromo";

export const metadata: Metadata = { title: "Articles", description: "Short articles on ritual, movement and living by the moon." };

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  const [posts, topics] = await Promise.all([listPosts("article", { topic }), listTopics("article")]);
  return (
    <>
      <PageHero eyebrow="Articles" title="Short reads for slow moments" intro="Concise articles to read with a cup of tea.">
        <TopicFilter base="/articles" topics={topics} active={topic} />
      </PageHero>
      <section className="container-page py-14 lg:py-20">
        {posts.length === 0 ? (
          <EmptyState title="No articles yet" text={topic ? `Nothing about “${topic}” yet.` : "The first articles are being written."} />
        ) : (
          <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">{posts.map((p, i) => <ArticleCard key={p.id} post={p} index={i} />)}</div>
        )}
      </section>
      <RetreatPromo />
    </>
  );
}
