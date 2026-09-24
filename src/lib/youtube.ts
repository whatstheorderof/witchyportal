/**
 * Reads Yulia's public YouTube channel without an API key:
 *  - the channel's public RSS feed (latest ~15 uploads, including Shorts)
 *  - oEmbed, to look up a video's title from a pasted link
 */

export interface FeedEntry {
  youtubeId: string;
  title: string;
  description: string;
  published: Date | null;
  kind: "short" | "video";
}

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .trim();

const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : "";
};

export function parseChannelFeed(xml: string): FeedEntry[] {
  const entries = xml.split("<entry>").slice(1).map((e) => e.split("</entry>")[0]);
  const out: FeedEntry[] = [];
  for (const e of entries) {
    const youtubeId = tag(e, "yt:videoId");
    if (!/^[A-Za-z0-9_-]{11}$/.test(youtubeId)) continue;
    const href = e.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/)?.[1] ?? "";
    const published = tag(e, "published");
    out.push({
      youtubeId,
      title: tag(e, "title") || "Untitled video",
      description: tag(e, "media:description").slice(0, 2000),
      published: published ? new Date(published) : null,
      kind: href.includes("/shorts/") ? "short" : "video",
    });
  }
  return out;
}

export function matchesWords(entry: Pick<FeedEntry, "title" | "description">, words: string): boolean {
  const list = words.split(",").map((w) => w.trim().toLowerCase()).filter(Boolean);
  if (!list.length) return true;
  const hay = `${entry.title} ${entry.description}`.toLowerCase();
  return list.some((w) => hay.includes(w));
}

export async function fetchChannelFeed(channelId: string): Promise<FeedEntry[]> {
  if (process.env.YOUTUBE_FETCH_DISABLED === "1") throw new Error("YouTube access is disabled in this environment");
  if (!/^UC[A-Za-z0-9_-]{22}$/.test(channelId)) throw new Error("That doesn't look like a YouTube channel id (it starts with UC).");
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
    headers: { "User-Agent": "WitchyPortal/1.0" },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`YouTube feed returned ${res.status}`);
  return parseChannelFeed(await res.text());
}

/** Looks up a video's public title. Returns null if YouTube can't be reached. */
export async function fetchVideoTitle(youtubeId: string, kind: "short" | "video"): Promise<string | null> {
  if (process.env.YOUTUBE_FETCH_DISABLED === "1") return null;
  const url = kind === "short" ? `https://www.youtube.com/shorts/${youtubeId}` : `https://www.youtube.com/watch?v=${youtubeId}`;
  try {
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string };
    return data.title?.slice(0, 300) ?? null;
  } catch {
    return null;
  }
}
