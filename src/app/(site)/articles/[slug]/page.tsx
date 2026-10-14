import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleLd, breadcrumbLd, pageMeta } from "@/lib/seo";
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
  return { post: await getPost("article", slug, { preview: isPreview }), isPreview };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { post } = await load(props);
  if (!post) return { title: "Not found" };
  return pageMeta({
    ownImage: true,
    title: post.title,
    description: post.seoDescription || post.excerpt || post.body,
    path: `/articles/${post.slug}`,
    type: "article",
    publishedTime: publishedAt(post),
    modifiedTime: post.updatedAt,
    noindex: post.status !== "published",
  });
}

export default async function ArticlePage(props: Props) {
  const { post, isPreview } = await load(props);
  if (!post) notFound();
  return (
    <>
      {!isPreview && <JsonLd data={[
        articleLd({ title: post.title, description: post.seoDescription || post.excerpt || post.body, path: `/articles/${post.slug}`, published: publishedAt(post), modified: post.updatedAt, image: post.cover?.url, section: "Articles" }),
        breadcrumbLd([["Articles", "/articles"], [post.title, `/articles/${post.slug}`]]),
      ]} />}
      <PostDetail post={post} back="/articles" backLabel="All articles" isPreview={isPreview} favType="article" href={`/articles/${post.slug}`} />
      <RelatedPosts title="More articles" posts={await relatedPosts(["article"], post.id, post.topic)} />
      <RetreatPromo />
    </>
  );
}
