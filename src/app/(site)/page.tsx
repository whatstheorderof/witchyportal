import Link from "next/link";
import { getMediaMap, getSetting } from "@/lib/settings";
import { getLivePostById, getLiveVideoById, latestShortPost, listHighlights, listPosts, listRetreats, listVideos } from "@/lib/queries";
import { MediaImage } from "@/components/MediaImage";
import { HeroVideo } from "@/components/HeroMedia";
import { RetreatCard } from "@/components/RetreatCard";
import { RetreatBookingCard } from "@/components/RetreatBookingCard";
import { SectionHeading } from "@/components/Section";
import { ArticleCard, AstrologyCard, ShortCard, TipCard } from "@/components/PostCards";
import { YouTubeEmbed } from "@/components/YouTube";
import { ArrowRight } from "@/components/Icons";
import { formatDate } from "@/lib/dates";
import { parseYouTubeId } from "@/lib/validation";
import { FULL_MOON_NAMES, moonNow, upcomingMoons } from "@/lib/astro/moon";
import { cardOfTheDay } from "@/lib/tarot";
import { CardSymbol } from "@/components/TarotCardView";
import { MoonGlyph } from "@/components/MoonGlyph";

const dated = (d: Date | null | undefined) => (d ? formatDate(d, { day: "numeric", month: "long", year: undefined }) : "");

export default async function HomePage() {
  const home = await getSetting("home");
  const [retreats, highlights, astro, articles, shorts, latestVideos, pickedVideo, pickedArticle, pickedTip, latestTip] = await Promise.all([
    listRetreats(),
    listHighlights(),
    listPosts("astrology", { limit: 1 }),
    listPosts("article", { limit: 4 }),
    listVideos({ kind: "short", limit: 8 }),
    listVideos({ limit: 1 }),
    getLiveVideoById(home.weekVideoPickId),
    getLivePostById(home.weekArticlePickId),
    getLivePostById(home.weekTipPickId),
    latestShortPost(),
  ]);
  const mediaMap = await getMediaMap([home.heroMediaId, home.heroVideoMediaId, home.introMediaId]);
  const heroImg = home.heroMediaId ? mediaMap.get(home.heroMediaId) : null;
  const heroVideo = home.heroVideoMediaId ? mediaMap.get(home.heroVideoMediaId) : null;
  const introImg = home.introMediaId ? mediaMap.get(home.introMediaId) : null;
  const featured = retreats.find((r) => r.id === home.featuredRetreatId) ?? retreats[0];
  const others = retreats.filter((r) => r.id !== featured?.id).slice(0, 2);
  const welcomeId = home.welcomeVideoUrl ? parseYouTubeId(home.welcomeVideoUrl) : null;

  const weekVideo = pickedVideo ?? latestVideos[0] ?? null;
  const weekArticle = pickedArticle ?? articles[0] ?? null;
  const weekTip = pickedTip ?? latestTip;
  const moreArticles = articles.filter((a) => a.id !== weekArticle?.id).slice(0, 3);

  const moon = moonNow();
  const nextMoon = upcomingMoons(1)[0];
  const card = cardOfTheDay();

  return (
    <>
      {/* HERO — what Witchy Portal offers, in a few seconds */}
      <section className="relative isolate flex min-h-[80svh] items-end overflow-hidden bg-plum-deep text-ivory lg:min-h-[88svh]">
        <div className="absolute inset-0 -z-10">
          <div className="ken-burns absolute inset-0">
            <MediaImage media={heroImg} fallback="horns" priority sizes="100vw" />
          </div>
          {heroVideo && <HeroVideo src={heroVideo.url} poster={heroVideo.posterUrl ?? heroImg?.url} />}
          <div className="scrim-hero absolute inset-0" />
        </div>
        <div className="container-page pb-24 pt-32 sm:pb-28 lg:pb-36">
          <p className="eyebrow reveal inline-block rounded-full bg-plum-deep/45 px-3 py-1.5 text-ivory backdrop-blur-sm">{home.heroEyebrow}</p>
          <h1 className="display-xl reveal mt-4 max-w-4xl text-ivory [text-shadow:0_2px_30px_rgb(42_16_37/0.35)]">{home.heroTitle}</h1>
          <p className="reveal mt-5 max-w-xl text-lg text-ivory/90 sm:text-xl">{home.heroSubtitle}</p>
          <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/retreats" className="btn-light">Explore Retreats <ArrowRight /></Link>
            <Link href="/about" className="btn-ghost-light">Meet Yulia</Link>
          </div>
        </div>
      </section>

      {/* NEXT RETREAT — all key facts together */}
      {featured && (
        <section aria-label="Next retreat" className="container-page relative z-10 -mt-14 sm:-mt-20">
          <RetreatBookingCard retreat={featured} />
        </section>
      )}

      {/* TODAY'S MAGIC */}
      <section aria-label="Today's magic" className="container-page grid gap-3 pt-8 sm:grid-cols-2">
        <Link href="/moon" className="group flex items-center gap-4 rounded-2xl bg-ivory-deep p-4 ring-1 ring-line transition hover:bg-white">
          <MoonGlyph angle={moon.angle} size={56} />
          <span className="min-w-0">
            <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-plum-soft">Tonight&rsquo;s moon</span>
            <span className="block font-display text-xl leading-tight text-plum">{moon.phaseName} in {moon.sign}</span>
            {nextMoon && <span className="block text-sm text-muted">Next {nextMoon.kind === "new" ? "new moon" : `full moon (${FULL_MOON_NAMES[nextMoon.date.getUTCMonth()]})`}: {formatDate(nextMoon.date, { weekday: "short", day: "numeric", month: "short", year: undefined })}</span>}
          </span>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-plum transition group-hover:translate-x-1" />
        </Link>
        <Link href="/tarot" className="group flex items-center gap-4 rounded-2xl bg-ivory-deep p-4 ring-1 ring-line transition hover:bg-white">
          <span aria-hidden className="grid h-14 w-10 shrink-0 place-items-center rounded-md border-2 border-ivory bg-plum font-display text-2xl text-ivory shadow-(--shadow-soft)"><CardSymbol card={card} /></span>
          <span className="min-w-0">
            <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-plum-soft">Card of the day</span>
            <span className="block font-display text-xl leading-tight text-plum">{card.name}</span>
            <span className="block truncate text-sm text-muted">{card.keywords}</span>
          </span>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-plum transition group-hover:translate-x-1" />
        </Link>
      </section>

      {/* MEET YULIA */}
      <section className="relative mt-16 overflow-hidden bg-sand/60 py-20 grain lg:mt-24 lg:py-28" aria-labelledby="meet-yulia">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">Your host</p>
            <h2 id="meet-yulia" className="display-lg mt-3">{home.introTitle}</h2>
            <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-ink/85">{home.introText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn-outline">Read Yulia&rsquo;s story <ArrowRight /></Link>
              <Link href="/watch" className="btn-outline">Watch Yulia</Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            {welcomeId ? (
              <figure>
                <YouTubeEmbed id={welcomeId} title="A welcome from Yulia" />
                <figcaption className="mt-3 text-sm text-muted">A welcome from Yulia</figcaption>
              </figure>
            ) : (
              <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] rounded-tl-[8rem]">
                <MediaImage media={introImg} fallback="golden" sizes="(min-width:1024px) 50vw, 92vw" className="object-[center_25%]" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* THIS WEEK WITH YULIA */}
      {(weekVideo || weekArticle || weekTip) && (
        <section className="container-page py-20 lg:py-28" aria-labelledby="this-week">
          <SectionHeading eyebrow="Fresh every week" title="This week with Yulia" intro="A video, a read and a little magic to carry with you." href="/discover" linkLabel="Discover more" />
          <h2 id="this-week" className="sr-only">This week with Yulia</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {weekVideo && (
              <article>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-plum-soft">Watch · {dated(weekVideo.publishAt ?? weekVideo.createdAt)}</p>
                <YouTubeEmbed id={weekVideo.youtubeId} title={weekVideo.title} vertical={weekVideo.kind === "short"} />
                <h3 className="mt-3 font-display text-2xl leading-snug text-plum">{weekVideo.title}</h3>
                <Link href="/watch" className="mt-2 inline-flex items-center gap-1 text-sm text-plum link-underline">More on Witchy TV <ArrowRight /></Link>
              </article>
            )}
            {weekArticle && (
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-plum-soft">Read</p>
                <ArticleCard post={weekArticle} index={0} />
              </div>
            )}
            {weekTip && (
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-plum-soft">{weekTip.type === "affirmation" ? "Affirmation" : weekTip.type === "motivation" ? "Motivation" : "Witchy tip"} · {dated(weekTip.publishAt ?? weekTip.createdAt)}</p>
                <TipCard post={weekTip} index={1} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* WHY WOMEN COME — from the featured retreat */}
      {featured && featured.benefits.length > 0 && (
        <section className="relative isolate overflow-hidden bg-plum-deep py-20 text-ivory lg:py-28" aria-labelledby="why-come">
          <div className="absolute inset-0 -z-10 opacity-30">
            <MediaImage media={featured.hero} fallback="sea" sizes="100vw" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-plum-deep via-plum-deep/90 to-plum-deep/60" />
          <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow text-blush">{featured.title}</p>
              <h2 id="why-come" className="display-lg mt-3 text-ivory">{featured.tagline || "What you'll take home"}</h2>
              <p className="mt-5 max-w-lg text-lg text-ivory/80">{featured.summary}</p>
              <Link href={`/retreats/${featured.slug}`} className="btn-light mt-8">Discover the retreat <ArrowRight /></Link>
            </div>
            <ul className="grid gap-3">
              {featured.benefits.map((b, i) => (
                <li key={i} className="flex gap-4 rounded-2xl bg-ivory/8 p-4 ring-1 ring-ivory/10">
                  <span aria-hidden className="font-display text-2xl text-blush">✦</span>
                  <span className="text-ivory/90">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* HIGHLIGHTS */}
      {highlights.length > 0 && (
        <section className="container-page py-20 lg:py-28">
          <ul className="grid gap-6 md:grid-cols-3">
            {highlights.map((h, i) => (
              <li key={h.id} className="group relative min-h-[300px] overflow-hidden rounded-(--radius-card) bg-plum-deep text-ivory">
                <MediaImage media={h.media} fallback={(["veil", "sand", "horns"] as const)[i % 3]} sizes="(min-width:768px) 30vw, 92vw" className="opacity-80 transition duration-700 group-hover:scale-[1.04]" />
                <div className="scrim-card absolute inset-0" />
                <div className="relative flex h-full min-h-[300px] flex-col justify-end p-6">
                  {h.eyebrow && <p className="text-[0.7rem] uppercase tracking-[0.22em] text-blush">{h.eyebrow}</p>}
                  <h3 className="mt-2 font-display text-3xl text-ivory"><Link href={h.href} className="after:absolute after:inset-0">{h.title}</Link></h3>
                  {h.text && <p className="mt-2 text-ivory/80">{h.text}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FROM THE STARS + READS */}
      {(astro.length > 0 || moreArticles.length > 0) && (
        <section className="container-page pb-20 lg:pb-28">
          <SectionHeading eyebrow="Read" title="From the stars & the sea" href="/articles" linkLabel="All articles" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_2fr]">
            {astro[0] && <AstrologyCard post={astro[0]} featured index={0} />}
            <div className="grid gap-8 sm:grid-cols-2">{moreArticles.slice(0, 2).map((a, i) => <ArticleCard key={a.id} post={a} index={i + 1} />)}</div>
          </div>
        </section>
      )}

      {/* SHORTS */}
      {shorts.length > 0 && (
        <section className="bg-ivory-deep py-20 lg:py-28" aria-labelledby="shorts-title">
          <div className="container-page">
            <SectionHeading eyebrow="Ask a Witch" title="Little answers, big magic" href="/watch" linkLabel="Open Witchy TV" />
            <h2 id="shorts-title" className="sr-only">Ask a Witch shorts</h2>
          </div>
          <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:mx-auto lg:grid lg:max-w-[1320px] lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:px-12 lg:[&>*:nth-child(n+6)]:hidden">
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

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-plum-deep py-24 text-ivory lg:py-32">
        <div className="absolute inset-0 -z-10">
          <MediaImage fallback="dance" sizes="100vw" className="opacity-45 object-[center_30%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-plum-deep via-plum-deep/60 to-plum-deep/30" />
        </div>
        <div className="container-page text-center">
          <p className="eyebrow text-blush">Your place is waiting</p>
          <h2 className="display-lg mx-auto mt-4 max-w-3xl text-ivory">Salt air, ritual and a circle of kindred spirits</h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/retreats" className="btn-light">Explore Retreats <ArrowRight /></Link>
            <Link href="/contact" className="btn-ghost-light">Ask a question</Link>
          </div>
        </div>
      </section>
    </>
  );
}
