import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { getPage } from "@/lib/queries";
import { formatDate } from "@/lib/dates";
import { Markdown } from "@/components/Markdown";
import { getI18n } from "@/i18n/server";
import { localeMeta } from "@/i18n/meta";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  const { t, tc } = await getI18n();
  if (!page) return { title: t("Not found") };
  return localeMeta({ title: tc(page.title), description: `${t("{title} for Witchy Portal and Yulia Moon's retreats and services.", { title: tc(page.title) })} ${tc(page.body)}`, path: `/policies/${slug}` });
}

export default async function PolicyPage({ params }: Props) {
  const page = await getPage((await params).slug);
  if (!page) notFound();
  const { t, tc, date } = await getI18n();
  return (
    <article className="container-prose pt-28 pb-20 lg:pt-36">
      <p className="eyebrow">{t("Small print")}</p>
      <h1 className="display-lg mt-3">{tc(page.title)}</h1>
      <p className="mt-3 text-sm text-muted">{t("Last updated {date}", { date: date(page.updatedAt) })}</p>
      <div className="mt-10"><Markdown>{tc(page.body)}</Markdown></div>
    </article>
  );
}
