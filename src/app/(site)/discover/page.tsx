import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { listPosts, listVideos } from "@/lib/queries";
import { SectionHeading } from "@/components/Section";
import { YourDay } from "@/components/stars/YourDay";
import { ArticleCard, AstrologyCard, ShortCard, TipCard } from "@/components/PostCards";
import { discoverNav } from "@/components/nav";
import { ArrowRight } from "@/components/Icons";
import { RetreatPromo } from "@/components/RetreatPromo";

export const metadata: Metadata = pageMeta({
  title: "Discover: horoscopes, compatibility & moon magic",
  description: "Daily horoscopes, star sign and birth chart compatibility, moon phases, tarot, your birth chart and Yulia's witchy tips — everyday magic in one place.",
  path: "/discover",
});

const TOOLS = [
  { href: "/horoscope", label: "Daily horoscopes", blurb: "What's in store for every sign today, from the real sky." },
  { href: "/this-week-in-astrology", label: "This week in astrology", blurb: "The week's Moons, retrogrades and big aspects." },
  { href: "/compatibility", label: "Star sign compatibility", blurb: "Test any two signs in love and friendship." },
  { href: "/compatibility/love", label: "Love sign compatibility", blurb: "How your Venus signs love, from two birth dates." },
  { href: "/birth-chart", label: "Your birth chart", blurb: "Free natal chart with a full written report.", badge: "Free" },
  { href: "/compatibility/birth-chart", label: "Birth chart compatibility", blurb: "Your two whole charts, side by side.", badge: "New" },
  { href: "/tarot", label: "Tarot card of the day", blurb: "Draw today's card, or a three-card reading." },
  { href: "/moon/phases", label: "Moon phases", blurb: "What each phase means, and the magic for it." },
];

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
      <section className="relative overflow-hidden bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32 lg:pb-20">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-lavender/20 blur-3xl" />
        <div className="container-page relative grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div>
            <p className="eyebrow text-blush">Discover</p>
            <h1 className="display-lg mt-3 text-ivory">What do the stars have in store?</h1>
            <p className="mt-4 max-w-xl text-lg text-ivory/85">Your day at a glance, horoscopes read from the real sky, compatibility for every pairing, the Moon&rsquo;s phases and your whole birth chart — with Yulia&rsquo;s rituals to work with it all.</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {TOOLS.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="group flex h-full flex-col gap-1 rounded-2xl bg-ivory/[0.07] p-4 ring-1 ring-ivory/10 transition hover:bg-ivory/[0.12]">
                    <span className="flex items-center justify-between font-display text-xl">{t.label}{t.badge && <span className="rounded-full bg-blush px-2 py-0.5 font-sans text-[0.68rem] font-medium uppercase tracking-wider text-plum">{t.badge}</span>}</span>
                    <span className="text-sm text-ivory/75">{t.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <YourDay light={false} />
        </div>
      </section>

      <section className="container-page py-14 lg:py-20" aria-labelledby="more-h">
        <h2 id="more-h" className="display-md">More to explore</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {discoverNav.filter((d) => !TOOLS.some((t) => t.href === d.href)).map((d) => (
            <li key={d.href}>
              <Link href={d.href} className="group flex h-full flex-col justify-between gap-3 rounded-2xl bg-white/70 p-5 ring-1 ring-line transition hover:bg-white hover:shadow-(--shadow-soft)">
                <span className="font-display text-2xl text-plum">{d.label}</span>
                <span className="text-sm text-muted">{d.blurb}</span>
                <ArrowRight className="h-4 w-4 text-plum transition group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

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
          <div className="mt-10 grid gap-5 md:grid-cols-2">{astro.map((p, i) => <AstrologyCard key={p.id} post={p} featured={i === 0} index={i} />)}</div>
        </section>
      )}
      {shorts.length > 0 && (
        <section className="bg-ivory-deep py-16 lg:py-24">
          <div className="container-page"><SectionHeading eyebrow="Ask a Witch" title="Watch & listen" href="/ask-a-witch" /></div>
          <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:mx-auto lg:grid lg:max-w-[1320px] lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:px-12 lg:[&>*:nth-child(n+6)]:hidden">{shorts.map((v) => <ShortCard key={v.id} video={v} />)}</div>
        </section>
      )}
      {articles.length > 0 && (
        <section className="container-page py-16 lg:py-24">
          <SectionHeading eyebrow="Articles" title="Short reads" href="/articles" />
          <div className="mt-10 grid gap-10 md:grid-cols-3">{articles.map((a, i) => <ArticleCard key={a.id} post={a} index={i} />)}</div>
        </section>
      )}
      <RetreatPromo />
    </>
  );
}
