import type { Metadata } from "next";
import { listVideos } from "@/lib/queries";
import { PageHero, EmptyState, SectionHeading } from "@/components/Section";
import { ShortCard, VideoCard } from "@/components/PostCards";
import { TopicFilter } from "@/components/TopicFilter";
import { RetreatPromo } from "@/components/RetreatPromo";

export const metadata: Metadata = { title: "Ask a Witch", description: "Yulia Moon answers your questions in videos and Shorts." };

export default async function AskAWitchPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  const all = await listVideos();
  const topics = [...new Set(all.map((v) => v.topic).filter(Boolean))].sort();
  const list = topic ? all.filter((v) => v.topic === topic) : all;
  const shorts = list.filter((v) => v.kind === "short");
  const videos = list.filter((v) => v.kind === "video");
  return (
    <>
      <PageHero eyebrow="Ask a Witch" title="Your questions, answered on video" intro="Curated videos and Shorts from Yulia. Tap to play — nothing loads from YouTube until you do.">
        <TopicFilter base="/ask-a-witch" topics={topics} active={topic} />
      </PageHero>
      {list.length === 0 ? (
        <section className="container-page py-14"><EmptyState title="No videos yet" text="Yulia's first Ask a Witch videos will appear here soon." /></section>
      ) : (
        <>
          {shorts.length > 0 && (
            <section className="py-14 lg:py-20" aria-labelledby="shorts-h">
              <div className="container-page"><SectionHeading title="Shorts" /><h2 id="shorts-h" className="sr-only">Shorts</h2></div>
              <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:px-8 lg:mx-auto lg:grid lg:max-w-[1320px] lg:grid-cols-5 lg:px-12">
                {shorts.map((v) => <ShortCard key={v.id} video={v} />)}
              </div>
            </section>
          )}
          {videos.length > 0 && (
            <section className="container-page pb-20" aria-labelledby="videos-h">
              <SectionHeading title="Videos" /><h2 id="videos-h" className="sr-only">Videos</h2>
              <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3">{videos.map((v) => <VideoCard key={v.id} video={v} />)}</div>
            </section>
          )}
        </>
      )}
      <RetreatPromo eyebrow="Ask Yulia in person" />
    </>
  );
}
