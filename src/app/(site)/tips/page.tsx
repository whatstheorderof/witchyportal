import type { Metadata } from "next";
import { listPosts } from "@/lib/queries";
import { PageHero, EmptyState } from "@/components/Section";
import { TipCard } from "@/components/PostCards";
import { TopicFilter } from "@/components/TopicFilter";

export const metadata: Metadata = { title: "Witchy Tips", description: "Short witchy tips, affirmations and motivations from Yulia Moon." };

type Props = { searchParams: Promise<{ topic?: string; kind?: string }> };

export default async function TipsPage({ searchParams }: Props) {
  const { topic, kind } = await searchParams;
  const [tips, affirmations] = await Promise.all([listPosts("tip"), listPosts("affirmation")]);
  const all = [...tips, ...affirmations].sort((a, b) => +(b.publishAt ?? b.createdAt) - +(a.publishAt ?? a.createdAt));
  const topics = [...new Set(all.map((p) => p.topic).filter(Boolean))].sort();
  const filtered = all.filter((p) => (!topic || p.topic === topic) && (!kind || p.type === kind));
  return (
    <>
      <PageHero eyebrow="Witchy tips" title="Tips, affirmations & motivation" intro="Small, doable magic for busy days. Filter by topic to find what you need right now.">
        <TopicFilter base="/tips" topics={topics} active={topic} extra={[{ label: "Affirmations", value: "affirmation", param: "kind", active: kind === "affirmation" }, { label: "Tips", value: "tip", param: "kind", active: kind === "tip" }]} />
      </PageHero>
      <section className="container-page py-14 lg:py-20">
        {filtered.length === 0 ? (
          <EmptyState title="Nothing here yet" text={topic ? `No tips about “${topic}” yet — try another topic.` : "New tips are on their way. Check back soon."} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((p, i) => <TipCard key={p.id} post={p} index={i} />)}</div>
        )}
      </section>
    </>
  );
}
