import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { pages } from "@/db/schema";
import { AdminHeader, Panel } from "@/components/admin/ui";
import { AdminForm, Check, F } from "@/components/admin/AdminForm";
import { PublishFields } from "@/components/admin/PublishFields";
import { savePage } from "../../../actions";
import { SITE_TIMEZONE, toDateTimeLocal } from "@/lib/dates";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [p] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  if (!p) notFound();
  return (
    <>
      <AdminHeader back={{ href: "/admin/pages", label: "Policy pages" }} title={p.title} actions={<Link href={`/policies/${p.slug}`} target="_blank" className="btn-outline min-h-10 text-sm">View ↗</Link>} />
      <Panel title="Page">
        <AdminForm action={savePage} sticky>
          <input type="hidden" name="id" value={p.id} />
          <PublishFields status={p.status} publishAt={toDateTimeLocal(p.publishAt)} tz={SITE_TIMEZONE} />
          <div className="grid gap-4 sm:grid-cols-2"><F label="Title" name="title" defaultValue={p.title} required /><F label="Web address (slug)" name="slug" defaultValue={p.slug} mono required hint="Footer links expect: privacy, terms, booking-terms, cookies." /></div>
          <F label="Body" name="body" defaultValue={p.body} textarea rows={22} hint="Markdown supported." />
          <Check label="Still a template (needs review)" name="isPlaceholder" defaultChecked={p.isPlaceholder} />
        </AdminForm>
      </Panel>
    </>
  );
}
