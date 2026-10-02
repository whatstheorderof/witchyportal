export const primaryNav = [
  { href: "/retreats", label: "Retreats" },
  { href: "/watch", label: "Watch" },
  { href: "/discover", label: "Discover" },
  { href: "/birth-chart", label: "Birth Chart" },
  { href: "/about", label: "About Yulia" },
  { href: "/contact", label: "Contact" },
];

export const discoverNav = [
  { href: "/tips", label: "Witchy Tips", blurb: "Small rituals, affirmations and gentle motivation." },
  { href: "/articles", label: "Articles", blurb: "Short reads on magic, movement and living by the moon." },
  { href: "/astrology", label: "Astrology", blurb: "Weekly and seasonal wisdom from the sky." },
  { href: "/ask-a-witch", label: "Ask a Witch", blurb: "Yulia answers your questions on video." },
  { href: "/tarot", label: "Tarot", blurb: "Card of the day — and draw your own." },
  { href: "/moon", label: "Moon calendar", blurb: "Tonight's moon and the next new and full moons." },
];

/** Shortcut menu opened from the Witchy Portal logo. */
export const shortcutGroups = [
  {
    title: "Visit",
    items: [
      { href: "/", label: "Home", blurb: "Start here." },
      { href: "/retreats", label: "Retreats", blurb: "Dates, prices and booking." },
      { href: "/about", label: "About Yulia", blurb: "Her story and why she hosts retreats." },
      { href: "/watch", label: "Watch", blurb: "Witchy TV — all of Yulia's videos." },
      { href: "/birth-chart", label: "Birth Chart", blurb: "Your Sun, Moon and Rising in seconds." },
    ],
  },
  {
    title: "Discover",
    items: discoverNav,
  },
  {
    title: "Connect",
    items: [
      { href: "/socials", label: "Socials", blurb: "Instagram, YouTube and Etsy." },
      { href: "/contact", label: "Contact", blurb: "Questions, enquiries and collaborations." },
      { href: "/favourites", label: "Your favourites", blurb: "Everything you've saved on this device." },
    ],
  },
];
