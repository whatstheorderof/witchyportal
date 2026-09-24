import Link from "next/link";
import type { Media, Post } from "@/db/schema";
import { formatDate } from "@/lib/dates";
import { MediaImage } from "./MediaImage";
import { Markdown, PlaceholderNote } from "./Markdown";
import { ArrowLeft } from "./Icons";
import { PreviewBanner } from "./PreviewBanner";

export function PostDetail({ post, back, backLabel, isPreview }: { post: Post & { cover: Media | null }; back: string; backLabel: string; isPreview?: boolean }) {
  const when = post.publishAt ?? post.createdAt;
  return (
    <article>
      {isPreview && <PreviewBanner status={post.status} editHref={`/admin/content/${post.id}`} />}
      <header className="container-prose pt-28 lg:pt-36">
        <Link href={back} className="inline-flex items-center gap-2 text-sm text-plum link-underline"><ArrowLeft />{backLabel}</Link>
        <p className="mt-8 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted">
          {(post.period || post.topic) && <span className="text-plum-soft">{post.period || post.topic}</span>}
          <span aria-hidden>·</span>
          <time dateTime={when.toISOString()}>{formatDate(when)}</time>
        </p>
        <h1 className="display-lg mt-3">{post.title}</h1>
        {post.excerpt && <p className="mt-5 text-xl leading-relaxed text-muted">{post.excerpt}</p>}
        {post.isPlaceholder && <div className="mt-5"><PlaceholderNote>Sample post — replace or delete in Admin</PlaceholderNote></div>}
      </header>
      {post.cover && (
        <div className="container-page mt-10">
          <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-(--radius-card)">
            <MediaImage media={post.cover} priority sizes="(min-width:1024px) 1024px, 100vw" />
          </div>
        </div>
      )}
      <div className="container-prose py-12 lg:py-16"><Markdown>{post.body}</Markdown></div>
    </article>
  );
}
