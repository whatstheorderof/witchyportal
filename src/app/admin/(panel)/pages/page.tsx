import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { pages } from "@/db/schema";
import { AdminHeader, StatusPill } from "@/components/admin/ui";

export const metadata = { title: "Policy pages" };

export default async function PagesAdmin() {
  const rows = await db.select().from(pages).orderBy(asc(pages.title));
  return (
    <>
      <AdminHeader title="Policy pages" intro="Privacy, cookies, website terms and booking terms. These are templates — have them reviewed before launch." />
      <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-white/70 ring-1 ring-line">
        {rows.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div><Link href={`/admin/pages/${p.id}`} className="font-medium text-plum link-underline">{p.title}</Link><p className="mt-1 flex items-center gap-2 text-xs text-muted"><StatusPill status={p.status} />/policies/{p.slug}{p.isPlaceholder && <span className="placeholder-flag">Template</span>}</p></div>
            <Link href={`/admin/pages/${p.id}`} className="btn-outline min-h-10 text-sm">Edit</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
