import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/queries";
import { formatDate } from "@/lib/dates";
import { Markdown } from "@/components/Markdown";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage((await params).slug);
  return { title: page?.title ?? "Not found" };
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
