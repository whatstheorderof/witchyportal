import type { Metadata } from "next";
import Link from "next/link";
import { getMediaMap, getSetting } from "@/lib/settings";
import { MediaImage } from "@/components/MediaImage";
import { Markdown, PlaceholderNote } from "@/components/Markdown";
import { ArrowRight } from "@/components/Icons";
import { YouTubeEmbed } from "@/components/YouTube";
import { parseYouTubeId } from "@/lib/validation";

export const metadata: Metadata = { title: "About Yulia", description: "Yulia Moon's story, and why she hosts retreats." };

export default async function AboutPage() {
  const about = await getSetting("about");
  const m = await getMediaMap([about.portraitMediaId, about.secondaryMediaId]);
  const portrait = about.portraitMediaId ? m.get(about.portraitMediaId) : null;
  const secondary = about.secondaryMediaId ? m.get(about.secondaryMediaId) : null;
  const videoId = about.videoUrl ? parseYouTubeId(about.videoUrl) : null;
  const blocks = [
    { id: "story", eyebrow: "Her story", title: "Where it began", body: about.story },
    { id: "views", eyebrow: "On retreats", title: "Why time away matters", body: about.views },
    { id: "why", eyebrow: "Hosting", title: "Why Yulia hosts", body: about.why },
    { id: "hopes", eyebrow: "Intentions", title: "What she hopes you take home", body: about.hopes },
  ].filter((b) => b.body);

  return (
    <>
      <section className="relative isolate flex min-h-[80svh] items-end overflow-hidden bg-plum-deep text-ivory">
        <div className="absolute inset-0 -z-10">
          <MediaImage media={portrait} fallback="sea" priority sizes="100vw" className="object-[center_35%]" />
          <div className="scrim-hero absolute inset-0" />
        </div>
        <div className="container-page pb-14 pt-32">
          <p className="eyebrow text-blush">About</p>
          <h1 className="display-xl mt-3 text-ivory">{about.title}</h1>
          <p className="mt-4 max-w-xl text-lg text-ivory/85">{about.intro}</p>
        </div>
      </section>

      {videoId && (
        <section aria-labelledby="about-video" className="container-page pt-16 lg:pt-24">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow">Meet Yulia</p>
            <h2 id="about-video" className="display-md mt-3">Hear it from Yulia</h2>
            <div className="mt-8 overflow-hidden rounded-(--radius-card) shadow-[0_30px_60px_-30px_rgb(74_31_64/0.45)]">
              <YouTubeEmbed id={videoId} title={about.videoTitle || "Meet Yulia Moon"} />
            </div>
            {about.videoTitle && <p className="mt-3 text-sm text-muted">{about.videoTitle}</p>}
          </div>
        </section>
      )}

      <div className="container-page py-16 lg:py-24">
        {about.isPlaceholder && <div className="mb-10"><PlaceholderNote>This page uses placeholder text — Yulia to write her story in Admin → Settings → About</PlaceholderNote></div>}
        <div className="grid gap-16 lg:grid-cols-[1fr_380px] lg:gap-24">
          <div className="grid gap-16">
            {blocks.map((b) => (
              <section key={b.id} aria-labelledby={`about-${b.id}`}>
                <p className="eyebrow">{b.eyebrow}</p>
                <h2 id={`about-${b.id}`} className="display-md mt-3">{b.title}</h2>
                <div className="mt-6"><Markdown>{b.body}</Markdown></div>
              </section>
            ))}
          </div>
          <aside className="lg:pt-4">
            <div className="sticky top-28 grid gap-6">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] rounded-br-[7rem]">
                <MediaImage media={secondary} fallback="veil" sizes="(min-width:1024px) 380px, 92vw" />
              </div>
              <Link href="/retreats" className="btn-primary">Explore retreats <ArrowRight /></Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
