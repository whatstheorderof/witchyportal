import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";
import { socials } from "@content/socials";

export const SITE_NAME = "Witchy Portal";
/** Shown when a page has no description of its own (and used for the homepage). */
export const SITE_DESCRIPTION =
  "Witchy retreats by the sea, spells, tarot readings and astrology with Yulia Moon, a Slavic witch in London — plus a free daily tarot card, moon calendar and birth chart.";

/** Clip a description to Google's ~160-character snippet, ending on a whole word. */
export function clip(text: string, max = 158) {
  const t = text.replace(/\s+/g, " ").replace(/[*_#>`[\]]/g, "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).replace(/\s+\S*$/, "").replace(/[,;:—–-]\s*$/, "")}…`;
}

const DEFAULT_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "Witchy Portal — retreats and everyday magic with Yulia Moon" };

type PageMetaInput = {
  title: string;
  description: string;
  /** Path of the page, e.g. "/tarot" — becomes the canonical URL. */
  path: string;
  type?: "website" | "article";
  /** Use the title exactly as given (no "· Witchy Portal" suffix). */
  absoluteTitle?: boolean;
  noindex?: boolean;
  publishedTime?: Date | string | null;
  modifiedTime?: Date | string | null;
  /** The page has its own opengraph-image file — don't add the site-wide image. */
  ownImage?: boolean;
};

/**
 * Standard metadata for a public page: title, description, canonical URL, and
 * matching Open Graph / X (Twitter) tags. Social images come from the
 * opengraph-image files, so they're not set here.
 */
export function pageMeta({ title, description, path, type = "website", absoluteTitle, noindex, publishedTime, modifiedTime, ownImage }: PageMetaInput): Metadata {
  const desc = clip(description);
  const iso = (d?: Date | string | null) => (d ? new Date(d).toISOString() : undefined);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title,
      description: desc,
      siteName: SITE_NAME,
      locale: "en_GB",
      ...(ownImage ? {} : { images: [DEFAULT_IMAGE] }),
      ...(type === "article" ? { publishedTime: iso(publishedTime), modifiedTime: iso(modifiedTime), authors: ["Yulia Moon"] } : {}),
    },
    // The site-wide share image (src/app/opengraph-image.tsx). Pages with their own
    // opengraph-image file (retreats, posts) override this automatically.
    twitter: { card: "summary_large_image", title, description: desc, ...(ownImage ? {} : { images: [DEFAULT_IMAGE.url] }) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/* ---------------- Structured data (schema.org JSON-LD) ---------------- */

const abs = (path: string) => (/^https?:\/\//.test(path) ? path : `${siteUrl()}${path.startsWith("/") ? "" : "/"}${path}`);

/** Public profiles for Witchy Portal / Yulia Moon (Yulia's personal account is left out). */
export function sameAs() {
  return socials.filter((s) => !/yuliaromanova/i.test(s.url)).map((s) => s.url);
}

export function organizationLd(email?: string) {
  return {
    "@type": "Organization",
    "@id": abs("/#organization"),
    name: SITE_NAME,
    url: abs("/"),
    logo: abs("/logo.png"),
    description: SITE_DESCRIPTION,
    ...(email ? { email } : {}),
    founder: { "@id": abs("/about#yulia") },
    sameAs: sameAs(),
  };
}

export function personLd(opts: { description?: string; image?: string | null } = {}) {
  return {
    "@type": "Person",
    "@id": abs("/about#yulia"),
    name: "Yulia Moon",
    url: abs("/about"),
    jobTitle: "Witch, tarot reader and retreat host",
    ...(opts.description ? { description: clip(opts.description, 300) } : {}),
    ...(opts.image ? { image: abs(opts.image) } : {}),
    homeLocation: { "@type": "Place", name: "London, United Kingdom" },
    worksFor: { "@id": abs("/#organization") },
    sameAs: sameAs(),
  };
}

export function websiteLd() {
  return {
    "@type": "WebSite",
    "@id": abs("/#website"),
    name: SITE_NAME,
    url: abs("/"),
    inLanguage: "en-GB",
    publisher: { "@id": abs("/#organization") },
  };
}

export function breadcrumbLd(items: [name: string, path: string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as [string, string], ...items].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
  };
}

export function articleLd(p: { title: string; description: string; path: string; published: Date; modified: Date; image?: string | null; section?: string }) {
  return {
    "@type": "BlogPosting",
    headline: p.title.slice(0, 110),
    description: clip(p.description),
    url: abs(p.path),
    mainEntityOfPage: abs(p.path),
    datePublished: p.published.toISOString(),
    dateModified: p.modified.toISOString(),
    ...(p.image ? { image: abs(p.image) } : { image: abs("/opengraph-image") }),
    ...(p.section ? { articleSection: p.section } : {}),
    inLanguage: "en-GB",
    author: { "@id": abs("/about#yulia"), "@type": "Person", name: "Yulia Moon", url: abs("/about") },
    publisher: { "@id": abs("/#organization") },
  };
}

export function faqLd(items: { question: string; answer: string }[]) {
  if (!items.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
  };
}

export function videoLd(v: { youtubeId: string; title: string; description?: string; uploaded: Date }) {
  return {
    "@type": "VideoObject",
    name: v.title,
    description: clip(v.description || v.title, 300),
    thumbnailUrl: `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
    uploadDate: v.uploaded.toISOString(),
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
  };
}

export { abs as absoluteUrl };
