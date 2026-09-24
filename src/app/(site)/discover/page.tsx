import type { Metadata } from "next";
import Link from "next/link";
import { listPosts, listVideos } from "@/lib/queries";
import { PageHero, SectionHeading } from "@/components/Section";
import { ArticleCard, AstrologyCard, ShortCard, TipCard } from "@/components/PostCards";
import { discoverNav } from "@/components/nav";
import { ArrowRight } from "@/components/Icons";
import { RetreatPromo } from "@/components/RetreatPromo";

export const metadata: Metadata = { title: "Discover", description: "Witchy tips, affirmations, astrology, articles and Ask a Witch videos." };

export default async function DiscoverPage() {
  const [tips, affirmations, motivations, astro, articles, shorts] = await Promise.all([
    listPosts("tip", { limit: 3 }),
    listPosts("affirmation", { limit: 2 }),
    listPosts("motivation", { limit: 1 }),
    listPosts("astrology", { limit: 2 }),
    listPosts("article", { limit: 3 }),
    listVideos({ kind: "short", limit: 8 }),
  ]);
  return (
    <>
      <PageHero eyebrow="Discover" title="Little rituals for everyday magic" intro="Browse Yulia's tips, affirmations, astrology and short reads — fresh each week.">
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {discoverNav.map((d) => (
            <li key={d.href}>
              <Link href={d.href} className="group flex h-full flex-col justify-between gap-4 rounded-2xl bg-white/70 p-5 ring-1 ring-line transition hover:bg-white hover:shadow-(--shadow-soft)">
                <span className="font-display text-2xl text-plum">{d.label}</span>
                <span className="text-sm text-muted">{d.blurb}</span>
                <ArrowRight className="h-4 w-4 text-plum transition group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>

      {[...affirmations, ...tips].length > 0 && (
        <section className="container-page py-16 lg:py-24">
          <SectionHeading eyebrow="Witchy tips" title="Tips, affirmations & motivation" href="/tips" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...affirmations.slice(0, 1), ...motivations, ...tips].slice(0, 3).map((p, i) => <TipCard key={p.id} post={p} index={i} />)}
          </div>
        </section>
      )}
      {astro.length > 0 && (
        <section className="container-page pb-16 lg:pb-24">
          <SectionHeading eyebrow="Astrology" title="Wisdom from the sky" href="/astrology" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">{astro.map((p, i) => <AstrologyCard key={p.id} post={p} featured={i === 0} />)}</div>
        </section>
      )}
      {shorts.length > 0 && (
        <section className="bg-ivory-deep py-16 lg:py-24">
          <div className="container-page"><SectionHeading eyebrow="Ask a Witch" title="Watch & listen" href="/ask-a-witch" /></div>
          <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:px-8 lg:mx-auto lg:max-w-[1320px] lg:px-12">{shorts.map((v) => <ShortCard key={v.id} video={v} />)}</div>
        </section>
      )}
      {articles.length > 0 && (
        <section className="container-page py-16 lg:py-24">
          <SectionHeading eyebrow="Articles" title="Short reads" href="/articles" />
          <div className="mt-10 grid gap-10 md:grid-cols-3">{articles.map((a) => <ArticleCard key={a.id} post={a} />)}</div>
        </section>
      )}
      <RetreatPromo />
    </>
  );
}
