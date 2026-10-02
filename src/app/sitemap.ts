import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { listPosts, listRetreats } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticPaths = ["", "/retreats", "/about", "/discover", "/tips", "/articles", "/astrology", "/ask-a-witch", "/birth-chart", "/contact", "/socials", "/tarot", "/moon", "/watch", "/policies/privacy", "/policies/booking-terms", "/policies/terms", "/policies/cookies"];
  try {
    const [retreats, articles, astro, tips, affs, mots] = await Promise.all([listRetreats(), listPosts("article"), listPosts("astrology"), listPosts("tip"), listPosts("affirmation"), listPosts("motivation")]);
    return [
      ...staticPaths.map((p) => ({ url: base + p })),
      ...retreats.map((r) => ({ url: `${base}/retreats/${r.slug}`, lastModified: r.updatedAt })),
      ...articles.map((a) => ({ url: `${base}/articles/${a.slug}`, lastModified: a.updatedAt })),
      ...astro.map((a) => ({ url: `${base}/astrology/${a.slug}`, lastModified: a.updatedAt })),
      ...[...tips, ...affs, ...mots].map((a) => ({ url: `${base}/tips/${a.slug}`, lastModified: a.updatedAt })),
    ];
  } catch {
    return staticPaths.map((p) => ({ url: base + p }));
  }
}
