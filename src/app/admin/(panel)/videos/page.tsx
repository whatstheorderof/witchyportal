import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { AdminHeader, Empty, Notice, Panel, StatusPill } from "@/components/admin/ui";
import { AdminForm } from "@/components/admin/AdminForm";
import { addVideoLinks, importChannelVideos, saveVideo } from "../../actions";
import { F } from "@/components/admin/AdminForm";
import { getSetting } from "@/lib/settings";
import { fetchChannelFeed, videoSeries, type FeedEntry } from "@/lib/youtube";
import { formatDate } from "@/lib/dates";
import { VideoFields } from "./fields";

export const metadata = { title: "Ask a Witch videos" };

async function ChannelFeed({ channelId, matchWords, showWords, known }: { channelId: string; matchWords: string; showWords: string; known: Set<string> }) {
  let entries: FeedEntry[] = [];
  try {
    entries = await fetchChannelFeed(channelId);
  } catch (e) {
    return <Notice tone="warn">Couldn&rsquo;t read the YouTube channel right now ({e instanceof Error ? e.message : "unknown error"}). Try again later, or paste links below.</Notice>;
  }
  if (!entries.length) return <Empty>No videos found on the channel feed.</Empty>;
  return (
    <form action={importChannelVideos} className="grid gap-4">
      <ul className="grid gap-2">
        {entries.map((e) => {
          const added = known.has(e.youtubeId);
          const series = videoSeries(e, { matchWords, showWords });
          const match = series !== null;
          return (
            <li key={e.youtubeId}>
              <label className={`flex items-center gap-4 rounded-2xl p-3 ring-1 ring-line ${added ? "bg-ivory-deep/60 opacity-70" : "bg-white/80 has-[:checked]:ring-2 has-[:checked]:ring-plum"}`}>
                <input type="checkbox" name="pick" value={e.youtubeId} defaultChecked={!added && match} disabled={added} className="h-5 w-5 shrink-0 accent-plum" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.ytimg.com/vi/${e.youtubeId}/mqdefault.jpg`} alt="" className="hidden h-16 w-28 shrink-0 rounded-lg object-cover sm:block" loading="lazy" />
                <span className="min-w-0">
                  <span className="block font-medium">{e.title}</span>
                  <span className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
                    <span>{e.kind === "short" ? "Short" : "Video"}</span>
                    {series && <span className="text-plum">{series === "show" ? "Yulia Moon Show" : "Ask a Witch"}</span>}
                    {e.published && <span>{formatDate(e.published)}</span>}
                    {match && <span className="rounded-full bg-lavender px-2 text-plum">Ask a Witch</span>}
                    {added && <span className="rounded-full bg-success/15 px-2 text-success">Already on the site</span>}
                  </span>
                </span>
              </label>
              <input type="hidden" name={`title_${e.youtubeId}`} value={e.title} />
              <input type="hidden" name={`kind_${e.youtubeId}`} value={e.kind} />
              <input type="hidden" name={`desc_${e.youtubeId}`} value={e.description.slice(0, 400)} />
              <input type="hidden" name={`pub_${e.youtubeId}`} value={e.published?.toISOString() ?? ""} />
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <select name="status" className="input w-auto" aria-label="Add as" defaultValue="published">
          <option value="published">Add as published</option>
          <option value="draft">Add as drafts</option>
        </select>
        <button className="btn-primary min-h-11">Add ticked videos</button>
      </div>
    </form>
  );
}

export default async function VideosAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string; feed?: string; imported?: string }> }) {
  const sp = await searchParams;
  const [rows, yt] = await Promise.all([db.select().from(videos).orderBy(asc(videos.sortOrder), desc(videos.createdAt)), getSetting("youtube")]);
  const known = new Set(rows.map((r) => r.youtubeId));
  return (
    <>
      <AdminHeader title="Ask a Witch videos" intro="Curate YouTube videos and Shorts. They load privately (youtube-nocookie) only when a visitor presses play." />
      {sp.saved && <div className="mb-6"><Notice tone="ok">Video added.</Notice></div>}
      {sp.deleted && <div className="mb-6"><Notice tone="ok">Video removed.</Notice></div>}
      {sp.imported && <div className="mb-6"><Notice tone="ok">Added {sp.imported} video{sp.imported === "1" ? "" : "s"} from the channel.</Notice></div>}
      <div className="mb-8 grid gap-6">
        <Panel
          title="From your YouTube channel"
          intro={<>Reads the latest uploads from <a href={yt.channelUrl} target="_blank" rel="noopener noreferrer" className="link-underline">{yt.channelUrl.replace("https://www.", "")}</a>. Ask a Witch and Yulia Moon Show episodes are ticked for you. Automatic daily import: <strong>{yt.autoImport === "off" ? "off" : yt.autoImport === "all" ? "all new uploads" : "Ask a Witch & Yulia Moon Show episodes"}</strong> (<Link href="/admin/settings#youtube" className="link-underline">change</Link>).</>}
        >
          {sp.feed ? (
            <ChannelFeed channelId={yt.channelId} matchWords={yt.matchWords} showWords={yt.showWords} known={known} />
          ) : (
            <Link href="/admin/videos?feed=1" className="btn-primary min-h-11">Check channel for videos</Link>
          )}
        </Panel>
        <Panel title="Paste links" intro="For older videos (the channel feed only lists the most recent ~15). One link per line — titles are filled in from YouTube.">
          <AdminForm action={addVideoLinks} submitLabel="Add videos" resetOnSuccess>
            <F label="YouTube links" name="links" textarea rows={4} mono placeholder={"https://youtube.com/shorts/…\nhttps://youtu.be/…"} />
          </AdminForm>
        </Panel>
      </div>
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
        <Panel title="Add one video by hand"><AdminForm action={saveVideo} submitLabel="Add video"><VideoFields /></AdminForm></Panel>
      </div>
    </>
  );
}
