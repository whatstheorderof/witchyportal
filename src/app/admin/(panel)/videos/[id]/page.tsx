import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { AdminHeader, Panel } from "@/components/admin/ui";
import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { deleteVideo, saveVideo } from "../../../actions";
import { VideoFields } from "../fields";
import { YouTubeEmbed } from "@/components/YouTube";

export default async function EditVideo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [v] = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
  if (!v) notFound();
  return (
    <>
      <AdminHeader back={{ href: "/admin/videos", label: "All videos" }} title={v.title} />
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <Panel title="Details"><AdminForm action={saveVideo}><input type="hidden" name="id" value={v.id} /><VideoFields v={v} /></AdminForm></Panel>
        <div className="grid content-start gap-4"><YouTubeEmbed id={v.youtubeId} title={v.title} vertical={v.kind === "short"} /><ConfirmDelete action={deleteVideo} fields={{ id: v.id }} what="this video" /></div>
      </div>
    </>
  );
}
