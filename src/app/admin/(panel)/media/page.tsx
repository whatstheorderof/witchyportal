import { desc } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";
import { AdminHeader, Empty, Notice } from "@/components/admin/ui";
import { AdminForm, Check, F } from "@/components/admin/AdminForm";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { deleteMedia, updateMedia } from "../../actions";

export const metadata = { title: "Media library" };

export default async function MediaAdmin({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const { deleted } = await searchParams;
  const rows = await db.select().from(media).orderBy(desc(media.createdAt));
  return (
    <>
      <AdminHeader title="Media library" intro="Upload photos and dancing footage once, then pick them anywhere on the site. Every image needs alt text." />
      {deleted && <div className="mb-6"><Notice tone="ok">Deleted.</Notice></div>}
      <MediaUploader blobEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
      <div className="mt-8">
        {rows.length === 0 ? <Empty>No media yet.</Empty> : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((m) => (
              <li key={m.id} className="card overflow-hidden">
                <div className="aspect-[4/3] bg-sand">
                  {m.kind === "video" ? <video src={m.url} muted controls preload="metadata" className="h-full w-full object-cover" /> : /* eslint-disable-next-line @next/next/no-img-element */ <img src={m.url} alt={m.alt} className="h-full w-full object-cover" loading="lazy" />}
                </div>
                <div className="p-4">
                  <p className="mb-3 text-xs text-muted">{m.kind}{m.width ? ` · ${m.width}×${m.height}` : ""}{!m.alt && m.kind === "image" && <span className="ml-2 text-danger">Missing alt text</span>}</p>
                  <AdminForm action={updateMedia} className="grid gap-3">
                    <input type="hidden" name="id" value={m.id} />
                    <F label="Alt text" name="alt" defaultValue={m.alt} textarea rows={2} />
                    <F label="Caption (optional)" name="caption" defaultValue={m.caption} />
                    {m.kind === "video" && <F label="Poster image URL" name="posterUrl" defaultValue={m.posterUrl} mono hint="Shown before the video plays." />}
                    <Check label="Placeholder" name="isPlaceholder" defaultChecked={m.isPlaceholder} />
                  </AdminForm>
                  <div className="mt-3"><ConfirmDelete action={deleteMedia} fields={{ id: m.id }} what="this file" /></div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
