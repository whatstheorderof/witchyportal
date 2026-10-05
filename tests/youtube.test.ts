import { describe, it, expect } from "vitest";
import { matchesWords, parseChannelFeed, videoSeries } from "../src/lib/youtube";
import { parseYouTubeId } from "../src/lib/validation";

const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <title>Yulia Moon Portal</title>
 <entry>
  <id>yt:video:AAAAAAAAAAA</id><yt:videoId>AAAAAAAAAAA</yt:videoId>
  <title>Ask a Witch: how do I cleanse crystals? &amp; more</title>
  <link rel="alternate" href="https://www.youtube.com/shorts/AAAAAAAAAAA"/>
  <published>2026-09-20T10:00:00+00:00</published>
  <media:group><media:description>#askawitch quick answer</media:description></media:group>
 </entry>
 <entry>
  <id>yt:video:BBBBBBBBBBB</id><yt:videoId>BBBBBBBBBBB</yt:videoId>
  <title>Full moon tarot reading</title>
  <link rel="alternate" href="https://www.youtube.com/watch?v=BBBBBBBBBBB"/>
  <published>2026-09-18T10:00:00+00:00</published>
  <media:group><media:description>Weekly reading</media:description></media:group>
 </entry>
</feed>`;

describe("YouTube channel feed", () => {
  const entries = parseChannelFeed(FEED);
  it("parses entries", () => {
    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({ youtubeId: "AAAAAAAAAAA", kind: "short", title: "Ask a Witch: how do I cleanse crystals? & more" });
    expect(entries[1].kind).toBe("video");
    expect(entries[1].published?.toISOString()).toBe("2026-09-18T10:00:00.000Z");
  });
  it("filters Ask a Witch videos", () => {
    const words = "ask a witch, #askawitch";
    expect(entries.filter((e) => matchesWords(e, words)).map((e) => e.youtubeId)).toEqual(["AAAAAAAAAAA"]);
  });
  it("parses pasted links", () => {
    expect(parseYouTubeId("https://youtube.com/shorts/AAAAAAAAAAA?si=x")).toBe("AAAAAAAAAAA");
    expect(parseYouTubeId("https://youtu.be/BBBBBBBBBBB")).toBe("BBBBBBBBBBB");
    expect(parseYouTubeId("https://www.youtube.com/@YuliaMoonPortal")).toBeNull();
  });
});

describe("videoSeries", () => {
  const yt = { matchWords: "ask a witch, askawitch, #askawitch", showWords: "yulia moon show" };
  it("recognises Yulia Moon Show episodes by title, including the older naming", () => {
    expect(videoSeries({ title: "🔮 The Yulia Moon Show | Ep.23 - Friday 13th Magic", description: "" }, yt)).toBe("show");
    expect(videoSeries({ title: "🌜Yulia Moon Show🌙 Full Moon in Aries🔥", description: "" }, yt)).toBe("show");
  });
  it("keeps a show episode that mentions Ask a Witch in its description in the show", () => {
    expect(videoSeries({ title: "The Yulia Moon Show | Ep.3 – Witchy Q&A", description: "Send questions for Ask a Witch!" }, yt)).toBe("show");
  });
  it("recognises Ask a Witch episodes and Shorts", () => {
    expect(videoSeries({ title: "Ask A Witch Episode 🖤 1 ❤️", description: "" }, yt)).toBe("ask");
    expect(videoSeries({ title: "Overcome Fear & Doubt with Crystals | Ask a Witch #shorts", description: "" }, yt)).toBe("ask");
  });
  it("returns null for other uploads", () => {
    expect(videoSeries({ title: "Lavender Magic: Everyday Spells #shorts", description: "" }, yt)).toBeNull();
  });
});
