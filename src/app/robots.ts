import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const production = process.env.VERCEL_ENV === "production" || process.env.ALLOW_INDEXING === "true";
  return {
    rules: production ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/booking/"] }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
