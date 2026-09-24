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
  },
  experimental: {
    serverActions: { bodySizeLimit: "25mb" },
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
