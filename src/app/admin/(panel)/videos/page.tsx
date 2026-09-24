import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { AdminHeader, Empty, Notice, Panel, StatusPill } from "@/components/admin/ui";
import { AdminForm } from "@/components/admin/AdminForm";
import { saveVideo } from "../../actions";
import { VideoFields } from "./fields";

export const metadata = { title: "Ask a Witch videos" };

export default async function VideosAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const sp = await searchParams;
  const rows = await db.select().from(videos).orderBy(asc(videos.sortOrder), desc(videos.createdAt));
  return (
    <>
      <AdminHeader title="Ask a Witch videos" intro="Curate YouTube videos and Shorts. They load privately (youtube-nocookie) only when a visitor presses play." />
      {sp.saved && <div className="mb-6"><Notice tone="ok">Video added.</Notice></div>}
      {sp.deleted && <div className="mb-6"><Notice tone="ok">Video removed.</Notice></div>}
      {rows.length === 0 ? <Empty>No videos yet.</Empty> : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((v) => (
            <li key={v.id} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`} alt="" className="aspect-video w-full object-cover" loading="lazy" />
              <div className="p-4">
                <p className="font-medium">{v.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted"><StatusPill status={v.status} publishAt={v.publishAt} />{v.kind}{v.topic && ` · ${v.topic}`}</p>
                <Link href={`/admin/videos/${v.id}`} className="btn-outline mt-3 min-h-10 text-sm">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">
        <Panel title="Add a video"><AdminForm action={saveVideo} submitLabel="Add video"><VideoFields /></AdminForm></Panel>
      </div>
    </>
  );
}
