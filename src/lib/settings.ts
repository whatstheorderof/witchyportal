import "server-only";
import { connection } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { media, settings } from "@/db/schema";

export interface HomeSettings {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMediaId: string | null;
  /** Optional looping background video (mp4/webm uploaded to Media) */
  heroVideoMediaId: string | null;
  featuredRetreatId: string | null;
  introTitle: string;
  introText: string;
  introMediaId: string | null;
  /** Optional 30–60 second welcome video from Yulia (YouTube link) */
  welcomeVideoUrl: string;
  /** "This week with Yulia" picks — empty means "show the latest" */
  weekVideoPickId: string | null;
  weekArticlePickId: string | null;
  weekTipPickId: string | null;
}

export interface AboutSettings {
  title: string;
  intro: string;
  story: string;
  views: string;
  why: string;
  hopes: string;
  portraitMediaId: string | null;
  secondaryMediaId: string | null;
  isPlaceholder: boolean;
}

export interface ContactSettings {
  email: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  etsy: string;
  responseTime: string;
}

export interface YouTubeSettings {
  /** Channel id (starts with UC…) — used to read the channel's public feed */
  channelId: string;
  channelUrl: string;
  /** Daily automatic import: off | ask-a-witch (matching titles only) | all */
  autoImport: string;
  /** Words that mark a video as Ask a Witch (comma separated, case-insensitive) */
  matchWords: string;
}

export interface SiteSettings {
  announcement: string;
  newsletterTitle: string;
  newsletterText: string;
}

export const DEFAULTS = {
  home: {
    heroEyebrow: "Retreats · Rituals · Wisdom",
    heroTitle: "Come home to your wild, luminous self",
    heroSubtitle:
      "Seaside retreats, gentle magic and weekly wisdom with Yulia Moon. [Placeholder — Yulia to confirm wording]",
    heroMediaId: null,
    heroVideoMediaId: null,
    featuredRetreatId: null,
    introTitle: "Hello, I'm Yulia",
    introText:
      "[Placeholder introduction — replace with Yulia's own words in Admin → Settings → Homepage.] A short, warm paragraph about who Yulia is, what Witchy Portal is for and who her retreats are made for.",
    introMediaId: null,
    welcomeVideoUrl: "",
    weekVideoPickId: null,
    weekArticlePickId: null,
    weekTipPickId: null,
  } as HomeSettings,
  about: {
    title: "About Yulia",
    intro: "[Placeholder — a one-line welcome in Yulia's voice.]",
    story: "[Placeholder — Yulia's story. How she found this path, what shaped her, and what she practises today.]",
    views: "[Placeholder — Yulia's views on retreats: what makes time away meaningful, and how she approaches ritual, movement and rest.]",
    why: "[Placeholder — why Yulia hosts retreats.]",
    hopes: "[Placeholder — what Yulia hopes guests take home with them.]",
    portraitMediaId: null,
    secondaryMediaId: null,
    isPlaceholder: true,
  } as AboutSettings,
  contact: {
    email: "",
    instagram: "",
    youtube: "https://www.youtube.com/@YuliaMoonPortal",
    tiktok: "",
    etsy: "",
    responseTime: "Yulia usually replies within 2–3 working days.",
  } as ContactSettings,
  youtube: {
    channelId: "UCj3-UQXzdWlMcUTAJOMigLw",
    channelUrl: "https://www.youtube.com/@YuliaMoonPortal",
    autoImport: "ask-a-witch",
    matchWords: "ask a witch, askawitch, #askawitch",
  } as YouTubeSettings,
  site: {
    announcement: "",
    newsletterTitle: "Letters from the shore",
    newsletterText: "New retreat dates, seasonal rituals and a little moon magic — straight to your inbox. No spam, unsubscribe any time.",
  } as SiteSettings,
};

export type SettingsKey = keyof typeof DEFAULTS;

export async function getSetting<K extends SettingsKey>(key: K): Promise<(typeof DEFAULTS)[K]> {
  await connection(); // always read fresh — settings change without a deploy
  const [row] = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return { ...DEFAULTS[key], ...((row?.value as object) ?? {}) } as (typeof DEFAULTS)[K];
}

export async function saveSetting<K extends SettingsKey>(key: K, value: (typeof DEFAULTS)[K]) {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
}

export async function getMediaMap(ids: (string | null | undefined)[]) {
  const clean = [...new Set(ids.filter((x): x is string => Boolean(x)))];
  if (!clean.length) return new Map<string, typeof media.$inferSelect>();
  const rows = await db.select().from(media).where(inArray(media.id, clean));
  return new Map(rows.map((r) => [r.id, r]));
}
