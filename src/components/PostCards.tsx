import Link from "next/link";
import type { Media, Post, Video } from "@/db/schema";
import { formatDate } from "@/lib/dates";
import { MediaImage } from "./MediaImage";
import { YouTubeEmbed } from "./YouTube";
import { FavouriteButton } from "./ShareFavourite";

type P = Post & { cover: Media | null };

/** Posts without their own cover get one of Yulia's photos, chosen by slug so it stays the same on every visit. */
const ARTICLE_PHOTOS = ["wade", "dance", "golden", "horizon", "sea", "sand"] as const;
const ASTRO_PHOTOS = ["crown", "veilWings", "red", "crownPortrait", "veil", "horns", "veiledSea", "horizon"] as const;
/** In a list, rotate by position so neighbours differ; on its own, choose by slug. */
function photoFor<T extends readonly string[]>(list: T, slug: string, index?: number): T[number] {
  if (index != null) return list[index % list.length];
  let h = 2166136261;
  for (const c of slug) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  return list[h % list.length];
}
const when = (p: Post) => p.publishAt ?? p.createdAt;

export function ArticleCard({ post, index }: { post: P; index?: number }) {
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/2] overflow-hidden rounded-(--radius-card) bg-sand">
        <MediaImage media={post.cover} fallback={photoFor(ARTICLE_PHOTOS, post.slug, index)} sizes="(min-width:1024px) 30vw, 92vw" className="object-[center_25%] transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
        {post.topic && <span className="text-plum-soft">{post.topic}</span>}
        {post.topic && <span aria-hidden>·</span>}
        <time dateTime={when(post).toISOString()}>{formatDate(when(post))}</time>
      </p>
      <h3 className="mt-2 font-display text-2xl leading-snug text-plum">
        <Link href={`/articles/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
      </h3>
      {post.excerpt && <p className="mt-2 line-clamp-3 text-muted">{post.excerpt}</p>}
      {post.isPlaceholder && <span className="placeholder-flag mt-3 self-start">Sample</span>}
    </article>
  );
}

const TONES = ["bg-blush", "bg-lavender", "bg-sand", "bg-plum text-ivory"];

export function TipCard({ post, index = 0 }: { post: P; index?: number }) {
  const tone = TONES[index % TONES.length];
  const dark = tone.includes("text-ivory");
  const isAffirmation = post.type === "affirmation";
  return (
    <article className={`relative flex h-full flex-col justify-between gap-6 rounded-(--radius-card) p-6 sm:p-7 ${tone}`}>
      <div>
        <p className={`text-[0.7rem] font-medium uppercase tracking-[0.22em] ${dark ? "text-blush" : "text-plum-soft"}`}>
          {isAffirmation ? "Affirmation" : post.type === "motivation" ? "Motivation" : post.topic || "Witchy tip"}
        </p>
        {isAffirmation ? (
          <blockquote className={`mt-4 font-display text-[1.7rem] italic leading-snug ${dark ? "text-ivory" : "text-plum"}`}>
            <Link href={`/tips/${post.slug}`} className="after:absolute after:inset-0">“{post.title}”</Link>
          </blockquote>
        ) : (
          <h3 className={`mt-4 font-display text-[1.6rem] leading-snug ${dark ? "text-ivory" : "text-plum"}`}>
            <Link href={`/tips/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
          </h3>
        )}
        {(post.excerpt || post.body) && !isAffirmation && (
          <p className={`mt-3 ${dark ? "text-ivory/80" : "text-ink/80"}`}>{post.excerpt || post.body.slice(0, 220)}</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 text-xs">
        {post.isPlaceholder ? <span className="placeholder-flag">Sample</span> : <span />}
        <span className="flex items-center gap-2">
          <time className={dark ? "text-ivory/75" : "text-ink/75"} dateTime={when(post).toISOString()}>{formatDate(when(post), { month: "short", day: "numeric", year: undefined })}</time>
          <FavouriteButton compact dark={dark} item={{ key: `tip:${post.slug}`, type: "tip", title: post.title, href: `/tips/${post.slug}` }} />
        </span>
      </div>
    </article>
  );
}

export function AstrologyCard({ post, featured = false, index }: { post: P; featured?: boolean; index?: number }) {
  return (
    <article className={`group relative overflow-hidden rounded-(--radius-card) bg-plum-deep text-ivory ${featured ? "min-h-[420px]" : "min-h-[320px]"}`}>
      <MediaImage media={post.cover} fallback={photoFor(ASTRO_PHOTOS, post.slug, index)} sizes="(min-width:1024px) 45vw, 92vw" className="opacity-60 transition duration-700 group-hover:scale-[1.03]" />
      <div className="scrim-card absolute inset-0" />
      <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-6 sm:p-8">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-blush">{post.period || post.topic || "Astrology"}</p>
        <h3 className={`mt-2 font-display leading-tight text-ivory ${featured ? "text-4xl" : "text-3xl"}`}>
          <Link href={`/astrology/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
        </h3>
        {post.excerpt && <p className="mt-3 max-w-lg text-ivory/80">{post.excerpt}</p>}
        {post.isPlaceholder && <span className="placeholder-flag mt-3 self-start">Sample</span>}
      </div>
    </article>
  );
}

export function ShortCard({ video }: { video: Video }) {
  return (
    <figure className="w-[60vw] max-w-[230px] shrink-0 snap-start sm:w-[210px] lg:w-auto lg:min-w-0 lg:max-w-none">
      <YouTubeEmbed id={video.youtubeId} title={video.title} vertical />
      <figcaption className="mt-3 flex items-start justify-between gap-2 text-[0.95rem] leading-snug text-ink">
        <span className="line-clamp-2 min-w-0">
          {video.title}
          {video.isPlaceholder && <span className="placeholder-flag ml-2 align-middle">Sample</span>}
        </span>
        <FavouriteButton compact item={videoFav(video)} />
      </figcaption>
    </figure>
  );
}

export function VideoCard({ video }: { video: Video }) {
  return (
    <figure>
      <YouTubeEmbed id={video.youtubeId} title={video.title} />
      <figcaption className="mt-3">
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-xl text-plum">{video.title}</p>
          <FavouriteButton compact item={videoFav(video)} />
        </div>
        {video.description && <p className="mt-1 text-sm text-muted line-clamp-2">{video.description}</p>}
        {video.isPlaceholder && <span className="placeholder-flag mt-2">Sample</span>}
      </figcaption>
    </figure>
  );
}

function videoFav(v: Video) {
  return { key: `video:${v.youtubeId}`, type: "video" as const, title: v.title, href: `/watch?v=${v.youtubeId}` };
}
