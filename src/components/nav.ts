import { msg } from "@/i18n/config";

export const primaryNav = [
  { href: "/retreats", label: msg("Retreats") },
  { href: "/horoscope", label: msg("Horoscopes") },
  { href: "/birth-chart", label: msg("Birth Chart") },
  { href: "/discover", label: msg("Discover") },
  { href: "/services", label: msg("Services") },
  { href: "/about", label: msg("About Yulia") },
  { href: "/contact", label: msg("Contact") },
];

/** The astrology tools at the heart of Discover. */
export const starsNav = [
  { href: "/today", label: msg("Your day"), blurb: msg("Your astrological day at a glance.") },
  { href: "/horoscope", label: msg("Daily horoscopes"), blurb: msg("What's in store for every sign today.") },
  { href: "/this-week-in-astrology", label: msg("This week in astrology"), blurb: msg("The week's Moons, retrogrades and big aspects.") },
  { href: "/compatibility", label: msg("Compatibility"), blurb: msg("Star signs, love signs and birth charts together.") },
  { href: "/moon/phases", label: msg("Moon phases"), blurb: msg("What each phase means, and the magic for it.") },
  { href: "/calculators", label: msg("Calculators"), blurb: msg("Your rising, Moon, Venus and Mars signs and Saturn return.") },
];

export const discoverNav = [
  ...starsNav.slice(1),
  { href: "/tarot", label: msg("Tarot"), blurb: msg("Card of the day, and draw your own.") },
  { href: "/journal", label: msg("Your journal"), blurb: msg("Tarot pulls, dreams and Moon intentions, private to you.") },
  { href: "/dream-dictionary", label: msg("Dream dictionary"), blurb: msg("What your dreams mean, symbol by symbol.") },
  { href: "/correspondences", label: msg("Correspondences"), blurb: msg("Crystals, herbs and candle colours for every intention.") },
  { href: "/numerology", label: msg("Numerology"), blurb: msg("Your life path number and what it means.") },
  { href: "/moon", label: msg("Moon calendar"), blurb: msg("The year's new and full moons, eclipses and sabbats.") },
  { href: "/zodiac", label: msg("Zodiac signs"), blurb: msg("The twelve signs: traits, love and compatibility.") },
  { href: "/mercury-retrograde", label: msg("Mercury retrograde"), blurb: msg("Every retrograde and shadow, and what it means for you.") },
  { href: "/eclipses", label: msg("Eclipses"), blurb: msg("The year's eclipses, UK visibility and eclipse season.") },
  { href: "/chinese-zodiac", label: msg("Chinese zodiac"), blurb: msg("Your animal and element, and the Fire Goat year.") },
  { href: "/astrology", label: msg("Astrology"), blurb: msg("Weekly and seasonal wisdom from Yulia.") },
  { href: "/tips", label: msg("Witchy Tips"), blurb: msg("Small rituals, affirmations and gentle motivation.") },
  { href: "/articles", label: msg("Articles"), blurb: msg("Short reads on magic, movement and living by the moon.") },
  { href: "/ask-a-witch", label: msg("Ask a Witch"), blurb: msg("Yulia answers your questions on video.") },
];

/** Shortcut menu opened from the Witchy Portal logo. */
export const shortcutGroups = [
  {
    title: msg("Visit"),
    items: [
      { href: "/", label: msg("Home"), blurb: msg("Start here.") },
      { href: "/retreats", label: msg("Retreats"), blurb: msg("Dates, prices and booking.") },
      { href: "/services", label: msg("Work with Yulia"), blurb: msg("Spells, readings, astrology and party hire.") },
      { href: "/about", label: msg("About Yulia"), blurb: msg("Her story and why she hosts retreats.") },
      { href: "/watch", label: msg("Watch"), blurb: msg("Witchy TV — all of Yulia's videos.") },
      { href: "/birth-chart", label: msg("Birth Chart"), blurb: msg("Your full natal chart and written report, free.") },
    ],
  },
  {
    title: msg("Discover"),
    items: discoverNav,
  },
  {
    title: msg("Connect"),
    items: [
      { href: "/testimonials", label: msg("Testimonials"), blurb: msg("Kind words from clients.") },
      { href: "/socials", label: msg("Socials"), blurb: msg("Instagram, YouTube and Etsy.") },
      { href: "/contact", label: msg("Contact"), blurb: msg("Questions, enquiries and collaborations.") },
      { href: "/favourites", label: msg("Your favourites"), blurb: msg("Everything you've saved on this device.") },
      { href: "/journal", label: msg("Your journal"), blurb: msg("Tarot pulls, dreams and Moon intentions, private to you.") },
    ],
  },
];
