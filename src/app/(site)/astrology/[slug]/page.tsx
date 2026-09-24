import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/queries";
import { getAdmin } from "@/lib/auth";
import { PostDetail } from "@/components/PostDetail";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> };

async function load({ params, searchParams }: Props) {
  const { slug } = await params;
  const isPreview = (await searchParams).preview === "1" && Boolean(await getAdmin());
  return { post: await getPost("astrology", slug, { preview: isPreview }), isPreview };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { post } = await load(props);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.seoDescription || post.excerpt, openGraph: { type: "article", images: post.cover ? [{ url: post.cover.url }] : undefined } };
}

export default async function AstrologyPostPage(props: Props) {
  const { post, isPreview } = await load(props);
  if (!post) notFound();
  return <PostDetail post={post} back="/astrology" backLabel="All astrology" isPreview={isPreview} />;
}
