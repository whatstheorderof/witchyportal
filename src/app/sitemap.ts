import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { listPosts, listRetreats } from "@/lib/queries";
import { SIGNS } from "@/lib/astro/types";

type Entry = MetadataRoute.Sitemap[number];

// [path, how often it changes, priority]
const STATIC: [string, Entry["changeFrequency"], number][] = [
  ["", "daily", 1],
  ["/retreats", "weekly", 0.9],
  ["/services", "monthly", 0.8],
  ["/about", "monthly", 0.8],
  ["/tarot", "daily", 0.8],
  ["/moon", "daily", 0.8],
  ["/birth-chart", "monthly", 0.9],
  ["/zodiac", "monthly", 0.7],
  ["/horoscope", "daily", 0.9],
  ...SIGNS.map((s) => [`/horoscope/${s.toLowerCase()}`, "daily", 0.8] as [string, Entry["changeFrequency"], number]),
  ...SIGNS.map((s) => [`/horoscope/${s.toLowerCase()}/monthly`, "weekly", 0.6] as [string, Entry["changeFrequency"], number]),
  ["/this-week-in-astrology", "daily", 0.8],
  ["/today", "daily", 0.6],
  ["/compatibility", "monthly", 0.8],
  ["/compatibility/love", "monthly", 0.7],
  ["/compatibility/birth-chart", "monthly", 0.7],
  ...SIGNS.flatMap((a, i) => SIGNS.slice(i).map((b) => [`/compatibility/${a.toLowerCase()}-and-${b.toLowerCase()}`, "monthly", 0.5] as [string, Entry["changeFrequency"], number])),
  ["/moon/phases", "daily", 0.7],
  ...SIGNS.map((s) => [`/zodiac/${s.toLowerCase()}`, "monthly", 0.6] as [string, Entry["changeFrequency"], number]),
  ["/ask-a-witch", "weekly", 0.7],
  ["/watch", "weekly", 0.6],
  ["/discover", "weekly", 0.6],
  ["/tips", "weekly", 0.6],
  ["/articles", "weekly", 0.6],
  ["/astrology", "weekly", 0.6],
  ["/testimonials", "monthly", 0.5],
  ["/contact", "yearly", 0.5],
  ["/socials", "yearly", 0.3],
  ["/policies/booking-terms", "yearly", 0.2],
  ["/policies/privacy", "yearly", 0.2],
  ["/policies/terms", "yearly", 0.2],
  ["/policies/cookies", "yearly", 0.2],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const abs = (u: string) => (/^https?:\/\//.test(u) ? u : base + u);
  const statics: MetadataRoute.Sitemap = STATIC.map(([p, changeFrequency, priority]) => ({ url: base + p, changeFrequency, priority }));
  try {
    const [retreats, articles, astro, tips, affs, mots] = await Promise.all([listRetreats(), listPosts("article"), listPosts("astrology"), listPosts("tip"), listPosts("affirmation"), listPosts("motivation")]);
    const post = (path: string) => (a: (typeof articles)[number]): Entry => ({
      url: `${base}${path}/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
      ...(a.cover?.url ? { images: [abs(a.cover.url)] } : {}),
    });
    return [
      ...statics,
      ...retreats.map((r): Entry => ({
        url: `${base}/retreats/${r.slug}`,
        lastModified: r.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
        ...(r.hero?.url ? { images: [abs(r.hero.url)] } : {}),
      })),
      ...articles.map(post("/articles")),
      ...astro.map(post("/astrology")),
      ...[...tips, ...affs, ...mots].map(post("/tips")),
    ];
  } catch {
    return statics;
  }
}
