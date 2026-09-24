import Link from "next/link";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts, postType, publishStatus } from "@/db/schema";
import { AdminHeader, Empty, Notice, StatusPill } from "@/components/admin/ui";
import { AdminForm, F } from "@/components/admin/AdminForm";
import { createPost } from "../../actions";
import { formatDate } from "@/lib/dates";

export const metadata = { title: "Content" };

const LABELS: Record<string, { title: string; one: string; intro: string; publicHref: string }> = {
  article: { title: "Articles", one: "article", intro: "Concise articles with a topic and publish date.", publicHref: "/articles" },
  tip: { title: "Witchy tips", one: "tip", intro: "Short, browsable tips. The excerpt is what's shown on the card.", publicHref: "/tips" },
  affirmation: { title: "Affirmations", one: "affirmation", intro: "The title is the affirmation itself.", publicHref: "/tips?kind=affirmation" },
  motivation: { title: "Motivations", one: "motivation", intro: "Short motivational notes — a title plus a few encouraging lines.", publicHref: "/tips?kind=motivation" },
  astrology: { title: "Astrology", one: "astrology post", intro: "Weekly or seasonal wisdom. Add a period label like “Libra season”.", publicHref: "/astrology" },
};

export default async function ContentList({ searchParams }: { searchParams: Promise<{ type?: string; status?: string; deleted?: string }> }) {
  const sp = await searchParams;
  const type = (postType.enumValues as readonly string[]).includes(sp.type ?? "") ? (sp.type as (typeof postType.enumValues)[number]) : "article";
  const status = (publishStatus.enumValues as readonly string[]).includes(sp.status ?? "") ? (sp.status as (typeof publishStatus.enumValues)[number]) : undefined;
  const L = LABELS[type];
  const rows = await db.select().from(posts).where(and(eq(posts.type, type), status ? eq(posts.status, status) : undefined)).orderBy(desc(sql`coalesce(${posts.publishAt}, ${posts.createdAt})`));
  return (
    <>
      <AdminHeader title={L.title} intro={L.intro} actions={<Link href={L.publicHref} target="_blank" className="btn-outline min-h-10 text-sm">View on site ↗</Link>} />
      {sp.deleted && <div className="mb-6"><Notice tone="ok">Deleted.</Notice></div>}
      <section className="card mb-8 p-5 sm:p-6">
        <AdminForm action={createPost} submitLabel={`Create ${L.one}`}>
          <input type="hidden" name="type" value={type} />
          <F label={type === "affirmation" ? "Affirmation" : "Title"} name="title" required />
        </AdminForm>
      </section>
      <nav aria-label="Filter by status" className="mb-4 flex flex-wrap gap-2">
        <Link href={`/admin/content?type=${type}`} className="chip min-h-9" aria-current={!status ? "true" : undefined}>All</Link>
        {publishStatus.enumValues.map((st) => <Link key={st} href={`/admin/content?type=${type}&status=${st}`} className="chip min-h-9 capitalize" aria-current={status === st ? "true" : undefined}>{st}</Link>)}
      </nav>
      {rows.length === 0 ? <Empty>Nothing here yet.</Empty> : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-white/70 ring-1 ring-line">
          {rows.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <Link href={`/admin/content/${p.id}`} className="font-medium text-plum link-underline">{p.title}</Link>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <StatusPill status={p.status} publishAt={p.publishAt} />
                  {p.topic && <span>{p.topic}</span>}
                  <span>{p.publishAt ? formatDate(p.publishAt, { hour: "2-digit", minute: "2-digit" }) : "No date"}</span>
                  {p.isPlaceholder && <span className="placeholder-flag">Sample</span>}
                </p>
              </div>
              <Link href={`/admin/content/${p.id}`} className="btn-outline min-h-10 text-sm">Edit</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
