import { notFound } from "next/navigation";
import { articleLd, breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { getPost, publishedAt, relatedPosts } from "@/lib/queries";
import { RelatedPosts } from "@/components/RelatedPosts";
import { getAdmin } from "@/lib/auth";
import { PostDetail } from "@/components/PostDetail";
import { RetreatPromo } from "@/components/RetreatPromo";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> };

async function load({ params, searchParams }: Props) {
  const { slug } = await params;
  const isPreview = (await searchParams).preview === "1" && Boolean(await getAdmin());
  return { post: await getPost("astrology", slug, { preview: isPreview }), isPreview };
}

export async function generateMetadata(props: Props) {
  const { post: original } = await load(props);
  if (!original) return { title: "Not found" };
  const post = (await getReadings()).post(original);
  return localeMeta({
    ownImage: true,
    title: post.title,
    description: post.seoDescription || post.excerpt || post.body,
    path: `/astrology/${post.slug}`,
    type: "article",
    publishedTime: publishedAt(post),
    modifiedTime: post.updatedAt,
    noindex: post.status !== "published",
  });
}

export default async function AstrologyPostPage(props: Props) {
  const { post: original, isPreview } = await load(props);
  if (!original) notFound();
  const rx = await getReadings();
  const t = rx.t, post = rx.post(original);
  return (
    <>
      {!isPreview && <JsonLd data={[
        articleLd({ title: post.title, description: post.seoDescription || post.excerpt || post.body, path: `/astrology/${post.slug}`, published: publishedAt(post), modified: post.updatedAt, image: post.cover?.url, section: t("Astrology"), inLanguage: rx.lang }),
        breadcrumbLd([[t("Astrology"), "/astrology"], [post.title, `/astrology/${post.slug}`]]),
      ]} />}
      <PostDetail post={original} back="/astrology" backLabel={t("All astrology")} isPreview={isPreview} favType="astrology" href={`/astrology/${post.slug}`} />
      <RelatedPosts title={t("More from the stars")} posts={await relatedPosts(["astrology"], post.id, post.topic)} />
      <RetreatPromo />
    </>
  );
}
