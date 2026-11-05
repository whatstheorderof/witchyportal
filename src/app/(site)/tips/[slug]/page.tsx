import Link from "@/i18n/client";
import { notFound } from "next/navigation";
import { articleLd, breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { getI18n } from "@/i18n/server";
import { localeMeta } from "@/i18n/meta";
import { msg } from "@/i18n/config";
import { JsonLd } from "@/components/JsonLd";
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

const LABEL = { tip: msg("Witchy tip"), affirmation: msg("Affirmation"), motivation: msg("Motivation") } as Record<string, string>;

export async function generateMetadata(props: Props) {
  const { post: original } = await load(props);
  if (!original) return { title: "Not found" };
  const rx = await getReadings();
  const post = rx.post(original);
  const label = rx.t(LABEL[post.type] ?? "Witchy tip");
  return localeMeta({
    ownImage: true,
    title: `${post.title} — ${label}`,
    description: post.seoDescription || post.excerpt || post.body || rx.t("A {label} from Yulia Moon.", { label: label.toLocaleLowerCase(rx.intl) }),
    path: `/tips/${post.slug}`,
    type: "article",
    publishedTime: post.publishAt ?? post.createdAt,
    modifiedTime: post.updatedAt,
    noindex: post.status !== "published",
  });
}

export default async function TipPage(props: Props) {
  const { post: original, isPreview } = await load(props);
  if (!original) notFound();
  const [rx, { tc }] = await Promise.all([getReadings(), getI18n()]);
  const t = rx.t, L = rx.lang, post = rx.post(original);
  const when = post.publishAt ?? post.createdAt;
  const isAffirmation = post.type === "affirmation";
  const related = await relatedPosts(["tip", "affirmation", "motivation"], post.id, post.topic);
  return (
    <>
      {isPreview && <PreviewBanner status={post.status} editHref={`/admin/content/${post.id}`} />}
      {!isPreview && <JsonLd data={[
        articleLd({ title: post.title, description: post.seoDescription || post.excerpt || post.body || post.title, path: `/tips/${post.slug}`, published: when, modified: post.updatedAt, section: t(LABEL[post.type] ?? "Witchy tip"), inLanguage: L }),
        breadcrumbLd([[t("Witchy tips"), "/tips"], [post.title, `/tips/${post.slug}`]]),
      ]} />}
      <article className="container-prose pb-6 pt-28 lg:pt-36">
        <Link href="/tips" className="inline-flex items-center gap-2 text-sm text-plum link-underline"><ArrowLeft />{t("All tips")}</Link>
        <div className={`mt-8 rounded-[2rem] p-8 sm:p-12 ${isAffirmation ? "bg-plum text-ivory" : "bg-blush"}`}>
          <p className={`flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.22em] ${isAffirmation ? "text-blush" : "text-plum-soft"}`}>
            <span>{t(LABEL[post.type] ?? "Witchy tip")}</span>
            {post.topic && <><span aria-hidden>·</span><span>{tc(post.topic)}</span></>}
          </p>
          <h1 lang={L} className={`mt-4 font-display leading-tight ${isAffirmation ? "text-4xl italic text-ivory sm:text-5xl" : "text-4xl text-plum sm:text-5xl"}`}>
            {isAffirmation ? `“${post.title}”` : post.title}
          </h1>
          {post.excerpt && <p lang={L} className={`mt-5 text-lg ${isAffirmation ? "text-ivory/85" : "text-ink/80"}`}>{post.excerpt}</p>}
          <p className={`mt-6 text-sm ${isAffirmation ? "text-ivory/75" : "text-ink/75"}`}>
            <time dateTime={when.toISOString()}>{formatDate(when, undefined, rx.intl)}</time> · Yulia Moon
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <FavouriteButton item={{ key: `tip:${post.slug}`, type: "tip", title: post.title, href: `/tips/${post.slug}` }} />
          <ShareButton title={post.title} text={post.excerpt || undefined} />
        </div>
        {post.isPlaceholder && <div className="mt-5"><PlaceholderNote>{t("Sample tip — replace or delete in Admin")}</PlaceholderNote></div>}
        {post.body && <div className="mt-10"><Markdown lang={L}>{post.body}</Markdown></div>}
      </article>
      <RelatedPosts title={t("More small magic")} posts={related} />
      <RetreatPromo eyebrow={t("From tips to transformation")} />
    </>
  );
}
