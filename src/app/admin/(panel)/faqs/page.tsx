import { asc, isNull } from "drizzle-orm";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { AdminHeader, Panel, StatusPill } from "@/components/admin/ui";
import { AdminForm, Check, F } from "@/components/admin/AdminForm";
import { PublishFields } from "@/components/admin/PublishFields";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { deleteFaq, saveFaq } from "../../actions";
import { SITE_TIMEZONE, toDateTimeLocal } from "@/lib/dates";

export const metadata = { title: "FAQs" };

export default async function FaqsAdmin() {
  const rows = await db.select().from(faqs).where(isNull(faqs.retreatId)).orderBy(asc(faqs.sortOrder));
  return (
    <>
      <AdminHeader title="General FAQs" intro="Shown on the Contact page. Retreat-specific FAQs are edited on each retreat." />
      <div className="grid gap-3">
        {rows.map((f) => (
          <details key={f.id} className="card p-5">
            <summary className="cursor-pointer font-medium">{f.question} <StatusPill status={f.status} publishAt={f.publishAt} /></summary>
            <div className="mt-4">
              <AdminForm action={saveFaq}>
                <input type="hidden" name="id" value={f.id} />
                <F label="Question" name="question" defaultValue={f.question} required />
                <F label="Answer" name="answer" defaultValue={f.answer} textarea required hint="Markdown supported." />
                <PublishFields status={f.status} publishAt={toDateTimeLocal(f.publishAt)} tz={SITE_TIMEZONE} />
                <div className="grid items-end gap-4 sm:grid-cols-2"><Check label="Placeholder" name="isPlaceholder" defaultChecked={f.isPlaceholder} /><F label="Sort order" name="sortOrder" type="number" defaultValue={f.sortOrder} /></div>
              </AdminForm>
              <div className="mt-3"><ConfirmDelete action={deleteFaq} fields={{ id: f.id }} what="this FAQ" /></div>
            </div>
          </details>
        ))}
      </div>
      <div className="mt-8">
        <Panel title="Add FAQ">
          <AdminForm action={saveFaq} submitLabel="Add FAQ" resetOnSuccess>
            <F label="Question" name="question" required />
            <F label="Answer" name="answer" textarea required />
            <PublishFields status="published" publishAt="" tz={SITE_TIMEZONE} />
            <F label="Sort order" name="sortOrder" type="number" defaultValue={rows.length} />
          </AdminForm>
        </Panel>
      </div>
    </>
  );
}
