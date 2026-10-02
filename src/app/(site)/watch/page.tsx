import type { Metadata } from "next";
import Link from "next/link";
import { listVideos } from "@/lib/queries";
import { getSetting } from "@/lib/settings";
import { matchesWords } from "@/lib/youtube";
import { WatchTV, type TVVideo } from "@/components/watch/WatchTV";
import { MoonMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Watch — Witchy TV",
  description: "Watch every Yulia Moon video in one place: Ask a Witch answers, tarot readings, moon rituals and Shorts, playing one after another.",
};

export default async function WatchPage({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
  const { v: startId } = await searchParams;
  const [rows, yt] = await Promise.all([listVideos({ limit: 500 }), getSetting("youtube")]);
  const videos: TVVideo[] = rows
    .map((v) => ({
      youtubeId: v.youtubeId,
      title: v.title,
      description: v.description,
      kind: v.kind,
      topic: v.topic,
      published: (v.publishAt ?? v.createdAt).toISOString(),
      askAWitch: matchesWords(v, yt.matchWords),
    }))
    .sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""));
  // A channel's uploads playlist is its id with "UC" swapped for "UU".
  const uploadsPlaylist = /^UC[A-Za-z0-9_-]{22}$/.test(yt.channelId) ? `UU${yt.channelId.slice(2)}` : null;

  return (
    <div className="min-h-dvh bg-[#14070f] pb-24 pt-20 text-ivory lg:pt-24">
      <div className="container-page">
        <header className="flex flex-wrap items-end justify-between gap-4 py-6 lg:py-8">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-blush"><MoonMark className="h-4 w-4" />Witchy TV</p>
            <h1 className="mt-2 font-display text-4xl text-ivory sm:text-5xl">Watch Yulia</h1>
            <p className="mt-2 max-w-xl text-ivory/70">Ask a Witch answers, tarot readings, moon rituals and Shorts — all of Yulia&rsquo;s videos, playing one after another.</p>
          </div>
          <div className="flex gap-2 text-sm">
            <Link href="/ask-a-witch" className="rounded-full border border-ivory/25 px-4 py-2.5 text-ivory/85 hover:border-ivory/60">Browse Ask a Witch</Link>
            {yt.channelUrl && <a href={`${yt.channelUrl}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ivory px-4 py-2.5 font-medium text-plum hover:bg-white">Subscribe ↗</a>}
          </div>
        </header>
        <WatchTV videos={videos} uploadsPlaylist={uploadsPlaylist} channelUrl={yt.channelUrl} startId={startId} />
      </div>
    </div>
  );
}
