import Link from "next/link";
import { getMediaMap, getSetting } from "@/lib/settings";
import { listHighlights, listPosts, listRetreats, listVideos } from "@/lib/queries";
import { MediaImage } from "@/components/MediaImage";
import { HeroVideo } from "@/components/HeroMedia";
import { RetreatCard } from "@/components/RetreatCard";
import { SectionHeading } from "@/components/Section";
import { ArticleCard, AstrologyCard, ShortCard, TipCard } from "@/components/PostCards";
import { AvailabilityBadge } from "@/components/Availability";
import { ArrowRight, CalendarIcon, PinIcon } from "@/components/Icons";
import { formatDateRange } from "@/lib/dates";
import { formatMoney } from "@/lib/money";

export default async function HomePage() {
  const [home, retreats, highlights, tips, affirmations, astro, articles, shorts] = await Promise.all([
    getSetting("home"),
    listRetreats(),
    listHighlights(),
    listPosts("tip", { limit: 2 }),
    listPosts("affirmation", { limit: 1 }),
    listPosts("astrology", { limit: 1 }),
    listPosts("article", { limit: 3 }),
    listVideos({ kind: "short", limit: 8 }),
  ]);
  const mediaMap = await getMediaMap([home.heroMediaId, home.heroVideoMediaId, home.introMediaId]);
  const heroImg = home.heroMediaId ? mediaMap.get(home.heroMediaId) : null;
  const heroVideo = home.heroVideoMediaId ? mediaMap.get(home.heroVideoMediaId) : null;
  const introImg = home.introMediaId ? mediaMap.get(home.introMediaId) : null;
  const featured = retreats.find((r) => r.id === home.featuredRetreatId) ?? retreats[0];
  const others = retreats.filter((r) => r.id !== featured?.id).slice(0, 2);
  const weekly = [...affirmations, ...tips];

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-plum-deep text-ivory lg:min-h-[100svh]">
        <div className="absolute inset-0 -z-10">
          <div className="ken-burns absolute inset-0">
            <MediaImage media={heroImg} fallback="horns" priority sizes="100vw" />
          </div>
          {heroVideo && <HeroVideo src={heroVideo.url} poster={heroVideo.posterUrl ?? heroImg?.url} />}
          <div className="scrim-hero absolute inset-0" />
        </div>
        <div className="container-page pb-28 pt-32 lg:pb-24">
          <p className="eyebrow reveal text-blush">{home.heroEyebrow}</p>
          <h1 className="display-xl reveal mt-4 max-w-4xl text-ivory [text-shadow:0_2px_30px_rgb(42_16_37/0.35)]">{home.heroTitle}</h1>
          <p className="reveal mt-5 max-w-xl text-lg text-ivory/85 sm:text-xl">{home.heroSubtitle}</p>
          <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={featured ? `/retreats/${featured.slug}` : "/retreats"} className="btn-light">
              {featured ? "Explore the retreat" : "Explore retreats"} <ArrowRight />
            </Link>
            <Link href="/about" className="btn-ghost-light">Meet Yulia</Link>
          </div>
        </div>
      </section>

      {/* FEATURED RETREAT */}
      {featured && (
        <section className="container-page py-20 lg:py-32" aria-labelledby="featured-title">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <div className="relative aspect-[4/5] overflow-hidden rounded-(--radius-card) bg-sand sm:aspect-[5/4] lg:aspect-[4/5]">
              <MediaImage media={featured.hero} fallback="sea" sizes="(min-width:1024px) 55vw, 92vw" />
              {featured.isPlaceholder && <span className="placeholder-flag absolute left-4 top-4">Sample retreat — replace in Admin</span>}
            </div>
            <div>
              <p className="eyebrow">Featured retreat</p>
              <h2 id="featured-title" className="display-lg mt-3">{featured.title}</h2>
              <p className="mt-3 flex items-center gap-1.5 text-muted"><PinIcon />{featured.location}{featured.country ? `, ${featured.country}` : ""}</p>
              <p className="mt-6 text-lg leading-relaxed text-ink/85">{featured.summary}</p>
              {featured.departures.length > 0 && (
                <ul className="mt-8 grid gap-3">
                  {featured.departures.slice(0, 3).map((d) => (
                    <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/60 px-4 py-3">
                      <span className="flex items-center gap-2"><CalendarIcon />{formatDateRange(d.startDate, d.endDate)}</span>
                      <AvailabilityBadge value={d.availability} note={d.availabilityNote} />
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link href={`/retreats/${featured.slug}#book`} className="btn-primary">View dates &amp; book <ArrowRight /></Link>
                {featured.fromPrice && <p className="text-muted">from <span className="font-display text-2xl text-plum">{formatMoney(featured.fromPrice.amount, featured.fromPrice.currency)}</span></p>}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* INTRO */}
      <section className="relative overflow-hidden bg-sand/60 py-20 lg:py-32 grain">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">Your host</p>
            <h2 className="display-lg mt-3">{home.introTitle}</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/85 whitespace-pre-line">{home.introText}</p>
            <Link href="/about" className="btn-outline mt-8">Read Yulia&rsquo;s story <ArrowRight /></Link>
          </div>
          <div className="relative order-1 aspect-[5/4] overflow-hidden rounded-[2rem] rounded-tl-[8rem] lg:order-2">
            <MediaImage media={introImg} fallback="sea" sizes="(min-width:1024px) 50vw, 92vw" />
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      {highlights.length > 0 && (
        <section className="container-page py-20 lg:py-28">
          <ul className="grid gap-6 md:grid-cols-3">
            {highlights.map((h, i) => (
              <li key={h.id} className="group relative min-h-[340px] overflow-hidden rounded-(--radius-card) bg-plum-deep text-ivory">
                <MediaImage media={h.media} fallback={(["veil", "sand", "horns"] as const)[i % 3]} sizes="(min-width:768px) 30vw, 92vw" className="opacity-80 transition duration-700 group-hover:scale-[1.04]" />
                <div className="scrim-card absolute inset-0" />
                <div className="relative flex h-full min-h-[340px] flex-col justify-end p-6">
                  {h.eyebrow && <p className="text-[0.7rem] uppercase tracking-[0.22em] text-blush">{h.eyebrow}</p>}
                  <h3 className="mt-2 font-display text-3xl text-ivory"><Link href={h.href} className="after:absolute after:inset-0">{h.title}</Link></h3>
                  {h.text && <p className="mt-2 text-ivory/80">{h.text}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* THIS WEEK */}
      {(weekly.length > 0 || astro.length > 0) && (
        <section className="container-page pb-20 lg:pb-28" aria-labelledby="week-title">
          <SectionHeading eyebrow="This week" title="Gentle magic for the days ahead" href="/discover" linkLabel="Discover more" />
          <h2 id="week-title" className="sr-only">This week</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_1fr_1fr]">
            {astro[0] && <AstrologyCard post={astro[0]} featured />}
            {weekly.slice(0, 2).map((p, i) => <TipCard key={p.id} post={p} index={i} />)}
          </div>
        </section>
      )}

      {/* SHORTS */}
      {shorts.length > 0 && (
        <section className="bg-ivory-deep py-20 lg:py-28" aria-labelledby="shorts-title">
          <div className="container-page">
            <SectionHeading eyebrow="Ask a Witch" title="Little answers, big magic" href="/ask-a-witch" linkLabel="All videos" />
            <h2 id="shorts-title" className="sr-only">Ask a Witch shorts</h2>
          </div>
          <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:mx-auto lg:max-w-[1320px] lg:px-12">
            {shorts.map((v) => <ShortCard key={v.id} video={v} />)}
          </div>
        </section>
      )}

      {/* MORE RETREATS */}
      {others.length > 0 && (
        <section className="container-page py-20 lg:py-28">
          <SectionHeading eyebrow="Retreats" title="More ways to gather" href="/retreats" linkLabel="All retreats" />
          <div className="mt-10 grid gap-10 md:grid-cols-2">{others.map((r) => <RetreatCard key={r.id} retreat={r} />)}</div>
        </section>
      )}

      {/* ARTICLES */}
      {articles.length > 0 && (
        <section className="container-page pb-20 lg:pb-28">
          <SectionHeading eyebrow="Read" title="Short articles" href="/articles" />
          <div className="mt-10 grid gap-10 md:grid-cols-3">{articles.map((a) => <ArticleCard key={a.id} post={a} />)}</div>
        </section>
      )}

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-plum-deep py-24 text-ivory lg:py-36">
        <div className="absolute inset-0 -z-10">
          <MediaImage fallback="sand" sizes="100vw" className="opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-plum-deep via-plum-deep/60 to-plum-deep/30" />
        </div>
        <div className="container-page text-center">
          <p className="eyebrow text-blush">Your place is waiting</p>
          <h2 className="display-lg mx-auto mt-4 max-w-3xl text-ivory">Salt air, slow mornings and a circle of kindred spirits</h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/retreats" className="btn-light">See dates &amp; prices <ArrowRight /></Link>
            <Link href="/contact" className="btn-ghost-light">Ask a question</Link>
          </div>
        </div>
      </section>
    </>
  );
}
