import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { getPage } from "@/lib/queries";
import { formatDate } from "@/lib/dates";
import { Markdown } from "@/components/Markdown";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return { title: "Not found" };
  return pageMeta({ title: page.title, description: `${page.title} for Witchy Portal and Yulia Moon's retreats and services. ${page.body}`, path: `/policies/${slug}` });
}

export default async function PolicyPage({ params }: Props) {
  const page = await getPage((await params).slug);
  if (!page) notFound();
  return (
    <article className="container-prose pt-28 pb-20 lg:pt-36">
      <p className="eyebrow">Small print</p>
      <h1 className="display-lg mt-3">{page.title}</h1>
      <p className="mt-3 text-sm text-muted">Last updated {formatDate(page.updatedAt)}</p>
      <div className="mt-10"><Markdown>{page.body}</Markdown></div>
    </article>
  );
}
