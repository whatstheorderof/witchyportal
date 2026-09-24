import { asc } from "drizzle-orm";
import { db } from "@/db";
import { highlights, type Highlight } from "@/db/schema";
import { AdminHeader, Panel, StatusPill } from "@/components/admin/ui";
import { AdminForm, F } from "@/components/admin/AdminForm";
import { PublishFields } from "@/components/admin/PublishFields";
import { MediaPicker, type PickerMedia } from "@/components/admin/MediaPicker";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { deleteHighlight, saveHighlight } from "../../actions";
import { pickerMedia } from "@/lib/admin-data";
import { SITE_TIMEZONE, toDateTimeLocal } from "@/lib/dates";
import Link from "next/link";

export const metadata = { title: "Homepage features" };

function Fields({ h, media }: { h?: Highlight; media: PickerMedia[] }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2"><F label="Small label" name="eyebrow" defaultValue={h?.eyebrow} /><F label="Title" name="title" defaultValue={h?.title} required /></div>
      <F label="Text" name="text" defaultValue={h?.text} />
      <div className="grid gap-4 sm:grid-cols-2"><F label="Link" name="href" defaultValue={h?.href ?? "/"} mono hint="e.g. /retreats or /birth-chart" /><F label="Sort order" name="sortOrder" type="number" defaultValue={h?.sortOrder ?? 0} /></div>
      <MediaPicker name="mediaId" label="Image" media={media} defaultValue={h?.mediaId} />
      <PublishFields status={h?.status ?? "published"} publishAt={toDateTimeLocal(h?.publishAt)} tz={SITE_TIMEZONE} />
    </>
  );
}

export default async function HighlightsAdmin() {
  const [rows, media] = await Promise.all([db.select().from(highlights).orderBy(asc(highlights.sortOrder)), pickerMedia()]);
  return (
    <>
      <AdminHeader title="Homepage features" intro={<>Image cards shown on the homepage below the introduction. The hero, featured retreat and intro text are in <Link href="/admin/settings" className="link-underline">Settings</Link>.</>} />
      <div className="grid gap-3">
        {rows.map((h) => (
          <details key={h.id} className="card p-5">
            <summary className="cursor-pointer font-medium">{h.title} <StatusPill status={h.status} publishAt={h.publishAt} /></summary>
            <div className="mt-4"><AdminForm action={saveHighlight}><input type="hidden" name="id" value={h.id} /><Fields h={h} media={media} /></AdminForm>
              <div className="mt-3"><ConfirmDelete action={deleteHighlight} fields={{ id: h.id }} what="this feature" /></div></div>
          </details>
        ))}
      </div>
      <div className="mt-8"><Panel title="Add feature"><AdminForm action={saveHighlight} submitLabel="Add" resetOnSuccess><Fields media={media} /></AdminForm></Panel></div>
    </>
  );
}
