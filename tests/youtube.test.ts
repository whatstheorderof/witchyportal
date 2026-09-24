import { describe, it, expect } from "vitest";
import { matchesWords, parseChannelFeed } from "../src/lib/youtube";
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
