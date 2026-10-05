"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/components/Track";

export interface TVVideo {
  youtubeId: string;
  title: string;
  description: string;
  kind: "short" | "video";
  topic: string;
  published: string | null;
  /** Which of Yulia's series this belongs to, if any */
  series: "ask" | "show" | null;
}

type Channel = { key: string; label: string; filter?: (v: TVVideo) => boolean; playlist?: boolean };

/* Minimal typing for the YouTube IFrame Player API */
interface YTPlayer {
  loadVideoById(id: string): void;
  loadPlaylist(o: { list: string; listType: "playlist"; index?: number }): void;
  getVideoData(): { title?: string; video_id?: string };
  destroy(): void;
}
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, o: object) => YTPlayer; PlayerState: { ENDED: number; PLAYING: number } };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

/** "🔮 The Yulia Moon Show | Ep.23 - Friday 13th…" → "Ep.23 - Friday 13th…" inside the show's own channel */
const showTitle = (t: string) => t.replace(/^[^A-Za-z]*(the\s+)?yulia moon show[^A-Za-z0-9]*\|?\s*/i, "").trim() || t;

const thumb = (id: string, q = "mqdefault") => `https://i.ytimg.com/vi/${id}/${q}.jpg`;
const fmt = (iso: string | null) => (iso ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)) : "");

export function WatchTV({ videos, uploadsPlaylist, channelUrl, startId, startChannel }: { videos: TVVideo[]; uploadsPlaylist: string | null; channelUrl: string; startId?: string; startChannel?: string }) {
  const channels = useMemo<Channel[]>(() => {
    const list: Channel[] = [];
    if (videos.length) list.push({ key: "all", label: "Everything" });
    if (videos.some((v) => v.series === "ask")) list.push({ key: "ask", label: "Ask a Witch", filter: (v) => v.series === "ask" });
    if (videos.some((v) => v.series === "show")) list.push({ key: "show", label: "The Yulia Moon Show", filter: (v) => v.series === "show" });
    if (videos.some((v) => v.kind === "short")) list.push({ key: "shorts", label: "Shorts", filter: (v) => v.kind === "short" });
    if (videos.some((v) => v.kind === "video")) list.push({ key: "videos", label: "Full episodes", filter: (v) => v.kind === "video" });
    for (const t of [...new Set(videos.map((v) => v.topic).filter(Boolean))].sort()) list.push({ key: `t:${t}`, label: t, filter: (v) => v.topic === t });
    if (uploadsPlaylist) list.push({ key: "channel", label: "Whole channel", playlist: true });
    return list;
  }, [videos, uploadsPlaylist]);

  const startIndex = startId ? videos.findIndex((v) => v.youtubeId === startId) : -1;
  const [channelKey, setChannelKey] = useState(
    startIndex >= 0 ? "all" : channels.some((c) => c.key === startChannel) ? startChannel! : channels[0]?.key ?? "channel",
  );
  const channel = channels.find((c) => c.key === channelKey) ?? channels[0];
  const queue = useMemo(() => (channel?.playlist ? [] : videos.filter(channel?.filter ?? (() => true))), [channel, videos]);
  const [index, setIndex] = useState(Math.max(0, startIndex));
  const [on, setOn] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [nowTitle, setNowTitle] = useState("");
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const state = useRef({ queue, index, autoplay, playlist: Boolean(channel?.playlist) });
  useEffect(() => {
    state.current = { queue, index, autoplay, playlist: Boolean(channel?.playlist) };
  });

  const current = channel?.playlist ? null : queue[index] ?? null;
  const isShort = current?.kind === "short";

  const next = useCallback((step = 1) => {
    const { queue: q } = state.current;
    if (!q.length) return;
    setIndex((i) => (i + step + q.length) % q.length);
  }, []);

  // Create the player the first time the viewer turns the TV on.
  useEffect(() => {
    if (!on || player.current || !host.current) return;
    track("watch_start", { channel: state.current.playlist ? "channel" : "list" });
    let cancelled = false;
    loadYouTubeApi().then(() => {
      if (cancelled || !host.current || !window.YT) return;
      const { queue: q, index: i, playlist } = state.current;
      player.current = new window.YT.Player(host.current, {
        host: "https://www.youtube-nocookie.com",
        width: "100%",
        height: "100%",
        videoId: playlist ? undefined : q[i]?.youtubeId,
        playerVars: {
          autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1, origin: window.location.origin,
          ...(playlist && uploadsPlaylist ? { listType: "playlist", list: uploadsPlaylist } : {}),
        },
        events: {
          onStateChange: (e: { data: number }) => {
            if (e.data === window.YT!.PlayerState.PLAYING) setNowTitle(player.current?.getVideoData().title ?? "");
            if (e.data === window.YT!.PlayerState.ENDED && state.current.autoplay && !state.current.playlist) next(1);
          },
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [on, next, uploadsPlaylist]);

  // Switch what's playing when the channel or position changes.
  const loaded = useRef<string>("");
  useEffect(() => {
    if (!on || !player.current) return;
    const key = channel?.playlist ? `pl:${uploadsPlaylist}` : `v:${current?.youtubeId}`;
    if (loaded.current === key) return;
    loaded.current = key;
    try {
      if (channel?.playlist && uploadsPlaylist) player.current.loadPlaylist({ list: uploadsPlaylist, listType: "playlist" });
      else if (current) player.current.loadVideoById(current.youtubeId);
    } catch {
      /* player not ready yet — it will start with the right video */
    }
  }, [on, channel, current, uploadsPlaylist]);

  useEffect(() => () => player.current?.destroy(), []);

  // Keyboard: ← / → to change programme when the TV has focus
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); next(-1); }
  };

  function choose(i: number) {
    setIndex(i);
    setOn(true);
    stageRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function switchChannel(key: string) {
    setChannelKey(key);
    setIndex(0);
  }

  const posterId = current?.youtubeId ?? videos[0]?.youtubeId;
  const watchUrl = current ? (current.kind === "short" ? `https://www.youtube.com/shorts/${current.youtubeId}` : `https://www.youtube.com/watch?v=${current.youtubeId}`) : channelUrl;

  return (
    <div className="grid gap-8" onKeyDown={onKeyDown}>
      {/* STAGE */}
      <div ref={stageRef} className="scroll-mt-24">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-black shadow-[0_30px_80px_-20px_rgb(201_127_115/0.35)] ring-1 ring-ivory/10">
          <div className="relative aspect-video w-full">
            {/* soft ambient backdrop */}
            {posterId && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumb(posterId, "hqdefault")} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl" />
            )}
            <div className={`absolute inset-0 flex items-center justify-center ${isShort ? "py-0" : ""}`}>
              <div className={isShort ? "relative aspect-[9/16] h-full" : "relative h-full w-full"}>
                <div ref={host} className="absolute inset-0 h-full w-full [&>iframe]:h-full [&>iframe]:w-full" />
              </div>
            </div>
            {!on && (
              <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-black/80 via-black/30 to-black/10 text-ivory">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-ivory text-plum shadow-2xl transition group-hover:scale-105 sm:h-24 sm:w-24">
                  <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9" aria-hidden="true"><path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.3-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" fill="currentColor" /></svg>
                </span>
                <span className="font-display text-2xl sm:text-3xl">Turn on Witchy TV</span>
                <span className="max-w-xs text-center text-sm text-ivory/70">Videos play one after another. Nothing loads from YouTube until you press play.</span>
              </button>
            )}
          </div>
        </div>

        {/* NOW PLAYING + CONTROLS */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-blush-deep/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blush">
            <span className={`h-2 w-2 rounded-full bg-blush ${on ? "animate-pulse" : ""}`} aria-hidden /> {on ? "On air" : "Off air"}
          </span>
          <p className="min-w-0 flex-1 truncate font-display text-xl text-ivory sm:text-2xl" aria-live="polite">
            {channel?.playlist ? nowTitle || "Whole channel — every upload in order" : current?.title ?? "No videos yet"}
          </p>
          <div className="flex items-center gap-2">
            {!channel?.playlist && (
              <>
                <button type="button" onClick={() => { setOn(true); next(-1); }} className="grid h-11 w-11 place-items-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20" aria-label="Previous video">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M6 5v14M18 6 9 12l9 6V6Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                </button>
                <button type="button" onClick={() => { setOn(true); next(1); }} className="grid h-11 w-11 place-items-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20" aria-label="Next video">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M18 5v14M6 6l9 6-9 6V6Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                </button>
                <label className="ml-1 flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-ivory/10 px-4 text-sm text-ivory">
                  <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} className="h-4 w-4 accent-blush-deep" />
                  Autoplay next
                </label>
              </>
            )}
            <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center rounded-full bg-ivory/10 px-4 text-sm text-ivory hover:bg-ivory/20">
              YouTube ↗
            </a>
          </div>
        </div>
        {current?.description && <p className="mt-2 line-clamp-2 max-w-3xl text-sm text-ivory/65">{current.description}</p>}
      </div>

      {/* CHANNELS */}
      <nav aria-label="Channels" className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <ul className="flex gap-2">
          {channels.map((c) => (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => switchChannel(c.key)}
                aria-pressed={c.key === channel?.key}
                className="min-h-11 whitespace-nowrap rounded-full border border-ivory/20 px-4 text-sm text-ivory/80 transition hover:border-ivory/50 hover:text-ivory aria-pressed:border-blush aria-pressed:bg-blush aria-pressed:text-plum-deep"
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* GUIDE */}
      {channel?.playlist ? (
        <p className="rounded-2xl bg-ivory/5 p-5 text-ivory/75">
          Playing every upload from the channel in order. Use the playlist button inside the player to jump around, or choose another channel above.
        </p>
      ) : queue.length === 0 ? (
        <p className="rounded-2xl bg-ivory/5 p-5 text-ivory/75">No videos in this channel yet.</p>
      ) : (
        <section aria-label="Programme guide">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-ivory/60">Up next · {queue.length} video{queue.length === 1 ? "" : "s"}</h2>
          <ol className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {queue.map((v, i) => {
              const active = i === index;
              return (
                <li key={v.youtubeId}>
                  <button type="button" onClick={() => choose(i)} aria-current={active ? "true" : undefined} className="group block w-full text-left">
                    <span className={`relative block overflow-hidden rounded-xl bg-plum ring-2 transition ${active ? "ring-blush" : "ring-transparent group-hover:ring-ivory/40"} ${v.kind === "short" ? "aspect-[4/5]" : "aspect-video"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumb(v.youtubeId, v.kind === "short" ? "hqdefault" : "mqdefault")} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 transition group-hover:scale-[1.03] group-hover:opacity-100" />
                      <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-ivory">{v.kind === "short" ? "Short" : "Episode"}</span>
                      {active && on && <span className="absolute inset-x-0 bottom-0 bg-blush px-2 py-1 text-xs font-medium text-plum-deep">Now playing</span>}
                    </span>
                    <span className="mt-2 line-clamp-2 block text-sm leading-snug text-ivory">{channel?.key === "show" ? showTitle(v.title) : v.title}</span>
                    {v.published && <span className="mt-0.5 block text-xs text-ivory/55">{fmt(v.published)}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}
