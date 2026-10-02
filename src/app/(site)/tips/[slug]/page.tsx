import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTipLike, relatedPosts } from "@/lib/queries";
import { getAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/dates";
import { Markdown, PlaceholderNote } from "@/components/Markdown";
import { ArrowLeft } from "@/components/Icons";
import { PreviewBanner } from "@/components/PreviewBanner";
import { FavouriteButton, ShareButton } from "@/components/ShareFavourite";
import { RelatedPosts } from "@/components/RelatedPosts";
import { RetreatPromo } from "@/components/RetreatPromo";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> };

async function load({ params, searchParams }: Props) {
  const { slug } = await params;
  const isPreview = (await searchParams).preview === "1" && Boolean(await getAdmin());
  return { post: await getTipLike(slug, { preview: isPreview }), isPreview };
}

const LABEL = { tip: "Witchy tip", affirmation: "Affirmation", motivation: "Motivation" } as Record<string, string>;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { post } = await load(props);
  if (!post) return { title: "Not found" };
  const label = LABEL[post.type] ?? "Witchy tip";
  return {
    title: `${post.title} — ${label}`,
    description: post.seoDescription || post.excerpt || post.body.slice(0, 155) || `A ${label.toLowerCase()} from Yulia Moon.`,
    openGraph: { type: "article" },
  };
}

export default async function TipPage(props: Props) {
  const { post, isPreview } = await load(props);
  if (!post) notFound();
  const when = post.publishAt ?? post.createdAt;
  const isAffirmation = post.type === "affirmation";
  const related = await relatedPosts(["tip", "affirmation", "motivation"], post.id, post.topic);
  return (
    <>
      {isPreview && <PreviewBanner status={post.status} editHref={`/admin/content/${post.id}`} />}
      <article className="container-prose pb-6 pt-28 lg:pt-36">
        <Link href="/tips" className="inline-flex items-center gap-2 text-sm text-plum link-underline"><ArrowLeft />All tips</Link>
        <div className={`mt-8 rounded-[2rem] p-8 sm:p-12 ${isAffirmation ? "bg-plum text-ivory" : "bg-blush"}`}>
          <p className={`flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.22em] ${isAffirmation ? "text-blush" : "text-plum-soft"}`}>
            <span>{LABEL[post.type]}</span>
            {post.topic && <><span aria-hidden>·</span><span>{post.topic}</span></>}
          </p>
          <h1 className={`mt-4 font-display leading-tight ${isAffirmation ? "text-4xl italic text-ivory sm:text-5xl" : "text-4xl text-plum sm:text-5xl"}`}>
            {isAffirmation ? `“${post.title}”` : post.title}
          </h1>
          {post.excerpt && <p className={`mt-5 text-lg ${isAffirmation ? "text-ivory/85" : "text-ink/80"}`}>{post.excerpt}</p>}
          <p className={`mt-6 text-sm ${isAffirmation ? "text-ivory/75" : "text-ink/75"}`}>
            <time dateTime={when.toISOString()}>{formatDate(when)}</time> · Yulia Moon
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <FavouriteButton item={{ key: `tip:${post.slug}`, type: "tip", title: post.title, href: `/tips/${post.slug}` }} />
          <ShareButton title={post.title} text={post.excerpt || undefined} />
        </div>
        {post.isPlaceholder && <div className="mt-5"><PlaceholderNote>Sample tip — replace or delete in Admin</PlaceholderNote></div>}
        {post.body && <div className="mt-10"><Markdown>{post.body}</Markdown></div>}
      </article>
      <RelatedPosts title="More small magic" posts={related} />
      <RetreatPromo eyebrow="From tips to transformation" />
    </>
  );
}
