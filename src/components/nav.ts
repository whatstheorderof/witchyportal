export const primaryNav = [
  { href: "/retreats", label: "Retreats" },
  { href: "/horoscope", label: "Horoscopes" },
  { href: "/birth-chart", label: "Birth Chart" },
  { href: "/discover", label: "Discover" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Yulia" },
  { href: "/contact", label: "Contact" },
];

/** The astrology tools at the heart of Discover. */
export const starsNav = [
  { href: "/today", label: "Your day", blurb: "Your astrological day at a glance." },
  { href: "/horoscope", label: "Daily horoscopes", blurb: "What's in store for every sign today." },
  { href: "/this-week-in-astrology", label: "This week in astrology", blurb: "The week's Moons, retrogrades and big aspects." },
  { href: "/compatibility", label: "Compatibility", blurb: "Star signs, love signs and birth charts together." },
  { href: "/moon/phases", label: "Moon phases", blurb: "What each phase means, and the magic for it." },
];

export const discoverNav = [
  ...starsNav.slice(1),
  { href: "/tarot", label: "Tarot", blurb: "Card of the day, and draw your own." },
  { href: "/moon", label: "Moon calendar", blurb: "The year's new and full moons, eclipses and sabbats." },
  { href: "/zodiac", label: "Zodiac signs", blurb: "The twelve signs: traits, love and compatibility." },
  { href: "/astrology", label: "Astrology", blurb: "Weekly and seasonal wisdom from Yulia." },
  { href: "/tips", label: "Witchy Tips", blurb: "Small rituals, affirmations and gentle motivation." },
  { href: "/articles", label: "Articles", blurb: "Short reads on magic, movement and living by the moon." },
  { href: "/ask-a-witch", label: "Ask a Witch", blurb: "Yulia answers your questions on video." },
];

/** Shortcut menu opened from the Witchy Portal logo. */
export const shortcutGroups = [
  {
    title: "Visit",
    items: [
      { href: "/", label: "Home", blurb: "Start here." },
      { href: "/retreats", label: "Retreats", blurb: "Dates, prices and booking." },
      { href: "/services", label: "Work with Yulia", blurb: "Spells, readings, astrology and party hire." },
      { href: "/about", label: "About Yulia", blurb: "Her story and why she hosts retreats." },
      { href: "/watch", label: "Watch", blurb: "Witchy TV — all of Yulia's videos." },
      { href: "/birth-chart", label: "Birth Chart", blurb: "Your full natal chart and written report, free." },
    ],
  },
  {
    title: "Discover",
    items: discoverNav,
  },
  {
    title: "Connect",
    items: [
      { href: "/testimonials", label: "Testimonials", blurb: "Kind words from clients." },
      { href: "/socials", label: "Socials", blurb: "Instagram, YouTube and Etsy." },
      { href: "/contact", label: "Contact", blurb: "Questions, enquiries and collaborations." },
      { href: "/favourites", label: "Your favourites", blurb: "Everything you've saved on this device." },
    ],
  },
];
