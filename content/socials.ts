/**
 * Links shown on the Socials page (/socials).
 * Add, remove or reorder entries — they appear on the site after the next deploy.
 * icon: "camera" (Instagram), "play" (YouTube), "bag" (shop), "star" (anything else)
 */
export const socials = [
  {
    label: "Witchy Portal",
    handle: "@witchyportal",
    url: "https://www.instagram.com/witchyportal/",
    platform: "Instagram",
    description: "Rituals, readings and retreat news — and where to send your Ask a Witch questions.",
    icon: "camera",
  },
  {
    label: "Yulia Romanova",
    handle: "@yuliaromanova_uk",
    url: "https://www.instagram.com/yuliaromanova_uk/",
    platform: "Instagram",
    description: "Yulia's personal Instagram.",
    icon: "camera",
  },
  {
    label: "The Yulia Moon Show",
    handle: "@YuliaMoonPortal",
    url: "https://www.youtube.com/@YuliaMoonPortal",
    platform: "YouTube",
    description: "Weekly tarot, moon rituals, dream interpretation and astrology forecasts.",
    icon: "play",
  },
  {
    label: "Witchy Portal shop",
    handle: "witchyportal.etsy.com",
    url: "https://witchyportal.etsy.com/",
    platform: "Etsy",
    description: "Magical goods from Yulia's shop.",
    icon: "bag",
  },
] as const;
