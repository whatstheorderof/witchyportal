import type { Metadata } from "next";
import Link from "next/link";
import { listVideos } from "@/lib/queries";
import { getSetting } from "@/lib/settings";
import { formatDate } from "@/lib/dates";
import { PageHero, EmptyState, SectionHeading } from "@/components/Section";
import { ShortCard, VideoCard } from "@/components/PostCards";
import { TopicFilter } from "@/components/TopicFilter";
import { YouTubeEmbed } from "@/components/YouTube";
import { ExternalIcon } from "@/components/Icons";
import { RetreatPromo } from "@/components/RetreatPromo";

export const metadata: Metadata = { title: "Ask a Witch", description: "Yulia Moon answers your questions — watch her Ask a Witch videos and Shorts." };

export default async function AskAWitchPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  const [all, yt, contact] = await Promise.all([listVideos(), getSetting("youtube"), getSetting("contact")]);
  const topics = [...new Set(all.map((v) => v.topic).filter(Boolean))].sort();
  const list = topic ? all.filter((v) => v.topic === topic) : all;
  const byDate = [...list].sort((a, b) => +(b.publishAt ?? b.createdAt) - +(a.publishAt ?? a.createdAt));
  const latest = topic ? null : byDate[0];
  const rest = list.filter((v) => v.id !== latest?.id);
  const shorts = rest.filter((v) => v.kind === "short");
  const videos = rest.filter((v) => v.kind === "video");
  const subscribe = yt.channelUrl ? `${yt.channelUrl.replace(/\/$/, "")}?sub_confirmation=1` : null;

  return (
    <>
      <PageHero eyebrow="Ask a Witch" title="Your questions, answered" intro="Yulia's Ask a Witch videos and Shorts, all in one place. Press play to watch right here — nothing loads from YouTube until you do.">
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/watch" className="btn-primary">Watch on Witchy TV</Link>
          {subscribe && (
            <a href={subscribe} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Subscribe on YouTube <ExternalIcon />
            </a>
          )}
          {contact.instagram ? (
            <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline">Send Yulia a question on Instagram <ExternalIcon /></a>
          ) : (
            <Link href="/contact" className="btn-outline">Send Yulia a question</Link>
          )}
        </div>
        <TopicFilter base="/ask-a-witch" topics={topics} active={topic} />
      </PageHero>

      {list.length === 0 ? (
        <section className="container-page py-14">
          <EmptyState
            title="Videos are on their way"
            text="Yulia's Ask a Witch videos will appear here soon. In the meantime you can watch them on her channel."
            action={yt.channelUrl ? <a href={yt.channelUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-2">Visit the channel <ExternalIcon /></a> : undefined}
          />
        </section>
      ) : (
        <>
          {latest && (
            <section className="container-page py-14 lg:py-20" aria-labelledby="latest-h">
              <div className={`grid items-center gap-8 ${latest.kind === "short" ? "md:grid-cols-[minmax(0,340px)_1fr] lg:gap-16" : "lg:grid-cols-[1.6fr_1fr] lg:gap-14"}`}>
                <div className={latest.kind === "short" ? "mx-auto w-full max-w-[340px]" : ""}>
                  <YouTubeEmbed id={latest.youtubeId} title={latest.title} vertical={latest.kind === "short"} />
                </div>
                <div>
                  <p className="eyebrow">Latest answer</p>
                  <h2 id="latest-h" className="display-md mt-3">{latest.title}</h2>
                  {latest.publishAt && <p className="mt-2 text-sm text-muted">{formatDate(latest.publishAt)}</p>}
                  {latest.description && <p className="mt-4 text-lg text-ink/80">{latest.description}</p>}
                  <a href={latest.kind === "short" ? `https://www.youtube.com/shorts/${latest.youtubeId}` : `https://www.youtube.com/watch?v=${latest.youtubeId}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-plum link-underline">
                    Watch on YouTube to like &amp; comment <ExternalIcon />
                  </a>
                </div>
              </div>
            </section>
          )}
          {shorts.length > 0 && (
            <section className="bg-ivory-deep py-14 lg:py-20" aria-labelledby="shorts-h">
              <div className="container-page"><SectionHeading title="Shorts" intro="Quick answers in under a minute." /><h2 id="shorts-h" className="sr-only">Shorts</h2></div>
              <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:px-8 lg:mx-auto lg:grid lg:max-w-[1320px] lg:grid-cols-5 lg:px-12">
                {shorts.map((v) => <ShortCard key={v.id} video={v} />)}
              </div>
            </section>
          )}
          {videos.length > 0 && (
            <section className="container-page py-14 lg:py-20" aria-labelledby="videos-h">
              <SectionHeading title="Longer answers" /><h2 id="videos-h" className="sr-only">Videos</h2>
              <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3">{videos.map((v) => <VideoCard key={v.id} video={v} />)}</div>
            </section>
          )}
        </>
      )}
      <RetreatPromo eyebrow="Ask Yulia in person" />
    </>
  );
}
