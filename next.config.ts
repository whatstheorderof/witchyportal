import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  serverExternalPackages: ["all-the-cities"],
  outputFileTracingIncludes: {
    "/api/places": ["./node_modules/all-the-cities/cities.pbf"],
    "/birth-chart": ["./node_modules/all-the-cities/cities.pbf"],
    // Social preview images read fonts and pre-cropped photos from ./assets
    "/**/opengraph-image*": ["./assets/**/*"],
    "/opengraph-image*": ["./assets/**/*"],
  },
  experimental: {
    serverActions: { bodySizeLimit: "25mb" },
  },
  // Addresses from the original WordPress witchyportal.com, so old links and bookmarks still work.
  async redirects() {
    const old: [string, string][] = [
      ["what-i-do", "/services"],
      ["new-service", "/services#dates"],
      ["courses", "/courses"],
      ["party-hire", "/services#events"],
      ["my-craft", "/about#craft"],
      ["contact", "/contact"],
    ];
    return [
      // Next.js removes the trailing slash first, so /index.php/what-i-do/ is covered too.
      ...old.map(([from, to]) => ({ source: `/index.php/${from}`, destination: to, permanent: true })),
      { source: "/index.php", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
