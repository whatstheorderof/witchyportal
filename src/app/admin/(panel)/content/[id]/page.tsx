import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { AdminHeader, Notice, Panel, StatusPill } from "@/components/admin/ui";
import { AdminForm, Check, F } from "@/components/admin/AdminForm";
import { PublishFields } from "@/components/admin/PublishFields";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { deletePost, updatePost } from "../../../actions";
import { pickerMedia } from "@/lib/admin-data";
import { SITE_TIMEZONE, toDateTimeLocal } from "@/lib/dates";

export const metadata = { title: "Edit content" };

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [p] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!p) notFound();
  const media = await pickerMedia();
  const { created } = await searchParams;
  const previewHref = p.type === "article" ? `/articles/${p.slug}?preview=1` : p.type === "astrology" ? `/astrology/${p.slug}?preview=1` : null;
  const short = p.type === "tip" || p.type === "affirmation";
  return (
    <>
      <AdminHeader
        back={{ href: `/admin/content?type=${p.type}`, label: "Back to list" }}
        title={p.title}
        intro={<span className="flex items-center gap-2 capitalize"><StatusPill status={p.status} publishAt={p.publishAt} /> {p.type}</span>}
        actions={previewHref ? <Link href={previewHref} target="_blank" className="btn-outline min-h-10 text-sm">Preview ↗</Link> : undefined}
      />
      {created && <div className="mb-6"><Notice tone="ok">Draft created.</Notice></div>}
      <div className="grid gap-8">
        <Panel title="Content">
          <AdminForm action={updatePost} sticky>
            <input type="hidden" name="id" value={p.id} />
            <PublishFields status={p.status} publishAt={toDateTimeLocal(p.publishAt)} tz={SITE_TIMEZONE} />
            <F label={p.type === "affirmation" ? "Affirmation" : "Title"} name="title" defaultValue={p.title} required textarea={p.type === "affirmation"} rows={2} />
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Topic" name="topic" defaultValue={p.topic} hint="Used for the topic filters, e.g. “Moon magic”." />
              {p.type === "astrology" ? <F label="Period" name="period" defaultValue={p.period} placeholder="e.g. Week of 21 Sept · Libra season" /> : <F label="Web address (slug)" name="slug" defaultValue={p.slug} mono required />}
            </div>
            {p.type === "astrology" && <F label="Web address (slug)" name="slug" defaultValue={p.slug} mono required />}
            {p.type !== "affirmation" && <F label={short ? "Tip text (shown on the card)" : "Excerpt"} name="excerpt" defaultValue={p.excerpt} textarea rows={3} />}
            {!short && <F label="Body" name="body" defaultValue={p.body} textarea rows={16} hint="Markdown: ## Heading, **bold**, *italic*, - lists, > quotes, [link](https://…)." />}
            {short && <input type="hidden" name="body" value={p.body} />}
            {!short && <MediaPicker name="coverMediaId" label="Cover image" media={media} defaultValue={p.coverMediaId} />}
            {!short && <F label="SEO description" name="seoDescription" defaultValue={p.seoDescription} maxLength={170} />}
            <Check label="Sample / placeholder" name="isPlaceholder" defaultChecked={p.isPlaceholder} />
          </AdminForm>
        </Panel>
        <Panel title="Delete"><ConfirmDelete action={deletePost} fields={{ id: p.id }} what={`this ${p.type}`} /></Panel>
      </div>
    </>
  );
}
