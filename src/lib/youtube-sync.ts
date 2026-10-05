import "server-only";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { getSetting } from "./settings";
import { fetchChannelFeed, videoSeries, type FeedEntry } from "./youtube";

/** Adds feed entries that aren't in the database yet. Returns how many were added. */
export async function importEntries(entries: FeedEntry[], status: "published" | "draft" = "published") {
  if (!entries.length) return 0;
  const existing = await db.select({ id: videos.youtubeId }).from(videos).where(inArray(videos.youtubeId, entries.map((e) => e.youtubeId)));
  const known = new Set(existing.map((e) => e.id));
  const fresh = entries.filter((e) => !known.has(e.youtubeId));
  if (!fresh.length) return 0;
  await db
    .insert(videos)
    .values(fresh.map((e) => ({
      youtubeId: e.youtubeId,
      kind: e.kind,
      title: e.title,
      description: e.description.split("\n")[0].slice(0, 400),
      topic: "",
      source: "channel",
      status,
      publishAt: e.published ?? new Date(),
    })))
    .onConflictDoNothing();
  return fresh.length;
}

/** Daily automatic sync, controlled by Admin → Settings → YouTube. */
export async function syncChannel() {
  const yt = await getSetting("youtube");
  if (yt.autoImport === "off" || !yt.channelId) return { skipped: true, added: 0 };
  const entries = await fetchChannelFeed(yt.channelId);
  const wanted = yt.autoImport === "all" ? entries : entries.filter((e) => videoSeries(e, yt) !== null);
  return { skipped: false, found: entries.length, matched: wanted.length, added: await importEntries(wanted) };
}
