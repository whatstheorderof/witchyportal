import type { Metadata } from "next";
import { breadcrumbLd, pageMeta, personLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import Link from "@/i18n/client";
import { getMediaMap, getSetting } from "@/lib/settings";
import { MediaImage } from "@/components/MediaImage";
import { Markdown, PlaceholderNote } from "@/components/Markdown";
import { ArrowRight } from "@/components/Icons";
import { craft } from "@content/craft";
import { testimonials } from "@content/testimonials";
import { TestimonialsStrip } from "@/components/Testimonials";
import Image from "next/image";
import { YouTubeEmbed } from "@/components/YouTube";
import { parseYouTubeId } from "@/lib/validation";
import { getI18n } from "@/i18n/server";
import { localeMeta } from "@/i18n/meta";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return localeMeta({
    title: t("About Yulia Moon"),
    description: t("Meet Yulia Moon, a Slavic witch in London who works across all paths of witchcraft — her story, her craft, and why she hosts witchy retreats by the sea."),
    path: "/about",
  });
}

export default async function AboutPage() {
  const raw = await getSetting("about");
  const { t, tc } = await getI18n();
  const about = { ...raw, title: tc(raw.title), intro: tc(raw.intro), story: tc(raw.story), views: tc(raw.views), why: tc(raw.why), hopes: tc(raw.hopes), videoTitle: tc(raw.videoTitle) };
  const m = await getMediaMap([about.portraitMediaId, about.secondaryMediaId, about.meetMediaId]);
  const meet = about.meetMediaId ? m.get(about.meetMediaId) : null;
  const portrait = about.portraitMediaId ? m.get(about.portraitMediaId) : null;
  const secondary = about.secondaryMediaId ? m.get(about.secondaryMediaId) : null;
  const videoId = about.videoUrl ? parseYouTubeId(about.videoUrl) : null;
  const blocks = [
    { id: "story", eyebrow: t("Her story"), title: t("Where it began"), body: about.story },
    { id: "views", eyebrow: t("On retreats"), title: t("Why time away matters"), body: about.views },
    { id: "why", eyebrow: t("Hosting"), title: t("Why Yulia hosts"), body: about.why },
    { id: "hopes", eyebrow: t("Intentions"), title: t("What she hopes you take home"), body: about.hopes },
  ].filter((b) => b.body);

  return (
    <>
      <JsonLd data={[personLd({ description: about.intro, image: portrait?.url ?? null }), breadcrumbLd([[t("About Yulia"), "/about"]])]} />
      <section className="relative isolate flex min-h-[80svh] items-end overflow-hidden bg-plum-deep text-ivory">
        <div className="absolute inset-0 -z-10">
          <MediaImage media={portrait} fallback="crown" priority sizes="100vw" className="object-[center_35%]" />
          <div className="scrim-hero absolute inset-0" />
        </div>
        <div className="container-page pb-14 pt-32">
          <p className="eyebrow text-blush">{t("About")}</p>
          <h1 className="display-xl mt-3 text-ivory">{about.title}</h1>
          <p className="mt-4 max-w-xl text-lg text-ivory/85">{about.intro}</p>
        </div>
      </section>

      {videoId && (
        <section aria-labelledby="about-video" className="container-page pt-16 lg:pt-24">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] rounded-ss-[7rem] lg:max-w-none">
              <MediaImage media={meet} fallback="golden" sizes="(min-width:1024px) 40vw, 92vw" className="object-[center_25%]" />
            </div>
            <div>
              <p className="eyebrow">{t("Meet Yulia")}</p>
              <h2 id="about-video" className="display-md mt-3">{t("Hear it from Yulia")}</h2>
              <div className="mt-8 overflow-hidden rounded-(--radius-card) shadow-[0_30px_60px_-30px_rgb(74_31_64/0.45)]">
                <YouTubeEmbed id={videoId} title={about.videoTitle || t("Meet Yulia Moon")} />
              </div>
              {about.videoTitle && <p className="mt-3 text-sm text-muted">{about.videoTitle}</p>}
            </div>
          </div>
        </section>
      )}

      <div className="container-page py-16 lg:py-24">
        {about.isPlaceholder && <div className="mb-10"><PlaceholderNote>{t("This page uses placeholder text — Yulia to write her story in Admin → Settings → About")}</PlaceholderNote></div>}
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
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] rounded-ee-[7rem]">
                <MediaImage media={secondary} fallback="red" sizes="(min-width:1024px) 380px, 92vw" />
              </div>
              <Link href="/services" className="btn-primary">{t("Work with Yulia")} <ArrowRight /></Link>
              <Link href="/retreats" className="btn-outline">{t("Explore retreats")}</Link>
            </div>
          </aside>
        </div>
      </div>

      <section id="miss-generation" className="scroll-mt-24 container-page pb-16 lg:pb-24" aria-labelledby="miss-generation-title">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14">
          <div>
            <p className="eyebrow">{t("Miss Generation 2025")}</p>
            <h2 id="miss-generation-title" className="display-md mt-3">{t("Crowned Miss Generation 2025")}</h2>
            <p className="mt-4 max-w-md text-muted">{t("The night Yulia won Miss Generation 2025: red feathers, a jewelled crown and a lot of joy.")}</p>
            <a href="https://www.youtube.com/shorts/aZITy31NNWA" target="_blank" rel="noopener noreferrer" className="btn-outline mt-6">
              {t("Watch Yulia talk about the win")} <ArrowRight />
            </a>
          </div>
          <ul className="grid aspect-[6/5] grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
            {[
              { src: "/images/miss-generation-sash.jpg", alt: t("Yulia smiling in her jewelled crown and Miss Generation 2025 sash, hands raised to the crown"), cls: "row-span-2 rounded-ss-[5rem]", pos: "object-[center_30%]", sizes: "(min-width:1024px) 28vw, 46vw" },
              { src: "/images/miss-generation-bouquet.jpg", alt: t("Yulia laughing on stage in her crown and Miss Generation sash, raising a bouquet of flowers"), cls: "", pos: "object-[center_25%]", sizes: "(min-width:1024px) 28vw, 46vw" },
              { src: "/images/miss-generation-crowning.jpg", alt: t("Yulia on stage in a red feathered gown and Miss Generation sash, holding the jewelled crown on her head"), cls: "rounded-ee-[5rem]", pos: "object-[center_35%]", sizes: "(min-width:1024px) 28vw, 46vw" },
            ].map((p) => (
              <li key={p.src} className={`relative overflow-hidden rounded-[1.5rem] ${p.cls}`}>
                <Image src={p.src} alt={p.alt} fill sizes={p.sizes} className={`object-cover ${p.pos}`} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="craft"className="scroll-mt-24 bg-plum-deep py-16 text-ivory lg:py-24" aria-labelledby="craft-title">
        <div className="container-page">
          <p className="eyebrow text-blush">{t("My craft")}</p>
          <h2 id="craft-title" className="display-md mt-2 text-ivory">{t("At Yulia’s altar")}</h2>
          <p className="mt-3 max-w-2xl text-ivory/80">{t("Candles, moonlight and fire — a glimpse of the rituals and spellwork behind Witchy Portal.")}</p>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {craft.map((c) => (
              <li key={c.src} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={c.src} alt={tc(c.alt)} fill sizes="(min-width:1024px) 25vw, 46vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TestimonialsStrip items={testimonials.filter((t) => t.featured)} />
    </>
  );
}
