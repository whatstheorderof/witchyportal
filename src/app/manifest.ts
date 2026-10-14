import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Witchy Portal — Yulia Moon",
    short_name: "Witchy Portal",
    description: "Witchy retreats, tarot, moon calendar and rituals with Yulia Moon.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf6ef",
    theme_color: "#4a1f40",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
