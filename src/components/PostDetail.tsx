import Link from "@/i18n/client";
import type { Media, Post } from "@/db/schema";
import { formatDate } from "@/lib/dates";
import { MediaImage } from "./MediaImage";
import { Markdown, PlaceholderNote } from "./Markdown";
import { ArrowLeft } from "./Icons";
import { PreviewBanner } from "./PreviewBanner";
import { FavouriteButton, ShareButton, type Favourite } from "./ShareFavourite";
import { getI18n } from "@/i18n/server";
import { getReadings } from "@/i18n/readings";

export async function PostDetail({ post: original, back, backLabel, isPreview, favType, href }: { post: Post & { cover: Media | null }; back: string; backLabel: string; isPreview?: boolean; favType: Favourite["type"]; href: string }) {
  const [{ t, tc, info: { intl } }, rx] = [await getI18n(), await getReadings()];
  const post = rx.post(original);
  const when = post.publishAt ?? post.createdAt;
  return (
    <article>
      {isPreview && <PreviewBanner status={post.status} editHref={`/admin/content/${post.id}`} />}
      <header className="container-prose pt-28 lg:pt-36">
        <Link href={back} className="inline-flex items-center gap-2 text-sm text-plum link-underline"><ArrowLeft />{backLabel}</Link>
        <p className="mt-8 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted">
          {(post.period || post.topic) && <span lang={post.period ? rx.lang : undefined} className="text-plum-soft">{post.period || tc(post.topic)}</span>}
          <span aria-hidden>·</span>
          <time dateTime={when.toISOString()}>{formatDate(when, undefined, intl)}</time>
        </p>
        <h1 lang={rx.lang} className="display-lg mt-3">{post.title}</h1>
        {post.excerpt && <p lang={rx.lang} className="mt-5 text-xl leading-relaxed text-muted">{post.excerpt}</p>}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <FavouriteButton item={{ key: `${favType}:${post.slug}`, type: favType, title: post.title, href }} />
          <ShareButton title={post.title} text={post.excerpt || undefined} />
        </div>
        {post.isPlaceholder && <div className="mt-5"><PlaceholderNote>{t("Sample post — replace or delete in Admin")}</PlaceholderNote></div>}
      </header>
      {post.cover && (
        <div className="container-page mt-10">
          <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-(--radius-card)">
            <MediaImage media={post.cover} priority sizes="(min-width:1024px) 1024px, 100vw" />
          </div>
        </div>
      )}
      <div className="container-prose py-12 lg:py-16"><Markdown lang={rx.lang}>{post.body}</Markdown></div>
    </article>
  );
}
