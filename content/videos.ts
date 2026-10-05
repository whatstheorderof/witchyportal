/**
 * Yulia's series episodes from youtube.com/@YuliaMoonPortal.
 *
 * Added to the site on the next deploy (each video once — if you hide or delete
 * one in /admin it stays that way). New uploads after this list are picked up
 * automatically every day; this file is for the back catalogue.
 *
 * kind: "video" for full episodes, "short" for Shorts.
 * date: the YouTube publish date (YYYY-MM-DD).
 */
export interface ContentVideo {
  id: string;
  date: string;
  kind: "video" | "short";
  title: string;
  description?: string;
}

export const videos: ContentVideo[] = [
  /* ---------------- Ask a Witch ---------------- */
  { id: "VAPWMktPgAM", date: "2026-08-15", kind: "video", title: "Ask A Witch Episode 11" },
  { id: "7vKOMW1fo4s", date: "2026-08-08", kind: "video", title: "Ask A Witch Episode 10💜🔥" },
  { id: "0Ag6WzdZc_o", date: "2026-07-28", kind: "video", title: "Ask A Witch Episode 9" },
  { id: "SpSy3J_t6yc", date: "2026-07-22", kind: "video", title: "Ask A Witch Episode 8" },
  { id: "sinrZ6PkNZM", date: "2026-07-18", kind: "video", title: "Ask A Witch Episode 7❤️💜✨️" },
  { id: "uBts5dv3X0k", date: "2026-07-04", kind: "short", title: "Overcome Fear & Doubt with Crystals | Ask a Witch", description: "Feeling fear and doubt? Black crystals like obsidian, tourmaline and black onyx, along with amethyst and clear quartz, are potent allies." },
  { id: "02xs9ljHmL8", date: "2026-06-25", kind: "video", title: "Ask A Witch Episode 6✨️💜✨️" },
  { id: "sZGXvjTenxs", date: "2026-06-19", kind: "video", title: "Ask A Witch Episode 5💜✨️" },
  { id: "WaKrfnHeK1s", date: "2026-05-29", kind: "video", title: "Ask A Witch Episode 4" },
  { id: "1J1cupcHeZA", date: "2026-05-18", kind: "video", title: "Ask A Witch Episode 3✨️✨️💜❤️" },
  { id: "DpxHnRRry-U", date: "2026-05-10", kind: "video", title: "Ask A Witch Episode 2" },
  { id: "hJ7vO8wlRos", date: "2026-04-28", kind: "video", title: "Ask A Witch Episode 🖤 1 ❤️" },
  { id: "IjRDclhKE4c", date: "2026-03-23", kind: "short", title: "Ask a Witch: Simple Self-Love Spell: Mirror Magic for Confidence", description: "Unlock self-love with a powerful mirror spell." },
  { id: "0pKZX0pXNdg", date: "2026-03-21", kind: "short", title: "Ask a Witch: Charge Crystals Under Full Moon: Easy Method Revealed", description: "Charging crystals under the full moon doesn't need to be complicated." },

  /* ---------------- The Yulia Moon Show ---------------- */
  { id: "sWSrRuNQNIM", date: "2026-02-15", kind: "video", title: "🔮 The Yulia Moon Show | Ep.23 - Friday 13th Magic, Valentine’s Love Spells & Solar Eclipse New Moon" },
  { id: "9oD0O1MoQ8A", date: "2026-02-09", kind: "video", title: "🔮 The Yulia Moon Show | Ep.22 - February Zodiac Readings | Love, Career & Turning Points" },
  { id: "DClEuljvVPk", date: "2026-01-29", kind: "video", title: "🔮 The Yulia Moon Show | Ep.21 - Lilith Energy & Divine Feminine Power, Dark Feminine Magic Explained" },
  { id: "i1t2lMwBX3g", date: "2026-01-21", kind: "video", title: "🔮 The Yulia Moon Show | Ep.20 - Vibrations, Tarot Balance & Birth Chart Basics + Energy Reset Spell" },
  { id: "B2U5ppWkQzI", date: "2026-01-12", kind: "video", title: "🔮 The Yulia Moon Show | Ep.19 - Snake Symbolism, Lilith Energy & Tarot Rituals with Major Arcana" },
  { id: "2F7AdtS-HIk", date: "2026-01-05", kind: "video", title: "🔮 The Yulia Moon Show | Ep.18 - 2026 New Year Zodiac Readings for Every Sign" },
  { id: "ClVQBUYhZuU", date: "2025-12-29", kind: "video", title: "🔮 The Yulia Moon Show | Ep.17 - New Year Energy & a Powerful 12-Candle Manifestation Ritual" },
  { id: "Re9Qs_LnkG4", date: "2025-12-22", kind: "video", title: "🔮 The Yulia Moon Show | Ep.16 - Magic Wands, Yuletide Energy & New Year Manifestation Spell" },
  { id: "dDGbh5Vz54s", date: "2025-12-16", kind: "video", title: "🔮 The Yulia Moon Show | Ep.15 - Yuletide Magic, Mistletoe Origins + Powerful Cord-Cutting Ritual" },
  { id: "0RGqHdHm73M", date: "2025-12-09", kind: "video", title: "🔮 The Yulia Moon Show | Ep.14 - 2026 Tarot Year Reading & Predictions | Luck, Change & Awakening" },
  { id: "FPQa8RQFoxs", date: "2025-12-02", kind: "video", title: "🔮 The Yulia Moon Show | Ep.13 - The Power of 13, Yuletide Magic & Tarot Guidance" },
  { id: "Ur9gbnPFZTg", date: "2025-11-26", kind: "video", title: "🔮 The Yulia Moon Show | Ep.12 - Spiritual Awakening Signs, Tarot & Rune Magic for Abundance" },
  { id: "ZEB1OP9jorw", date: "2025-11-18", kind: "video", title: "🔮 The Yulia Moon Show | Ep.11 - Who Is a Witch? Ancient Knowledge, Tarot Reading & Money Magic" },
  { id: "C-1R8UA0xw0", date: "2025-11-11", kind: "video", title: "🔮 The Yulia Moon Show | Ep.10 - Gratitude, Growth & Magic in Practice" },
  { id: "YaepqRDdEbc", date: "2025-11-04", kind: "video", title: "🔮 The Yulia Moon Show | Ep.9 - Sharing Magic, Gratitude & Knowledge" },
  { id: "7V1H2NOnPWE", date: "2025-10-30", kind: "video", title: "🔮 The Yulia Moon Show | Ep.8 - Halloween Energy & Manifestation | Feel the Magic of the Season" },
  { id: "lxY6Ty-csB0", date: "2025-10-24", kind: "video", title: "🔮 The Yulia Moon Show | Ep.7 - Halloween Magic & Witchy Style | Embrace the Spooky Energy" },
  { id: "k5HsrNEkR0w", date: "2025-10-17", kind: "video", title: "🔮 The Yulia Moon Show | Ep.6 - Halloween Glam & Tarot Energy: Witchy Inspiration & October Readings" },
  { id: "ZuiZF4c9sVo", date: "2025-10-10", kind: "video", title: "🔮 The Yulia Moon Show | Ep.5 – Halloween Energy: Witchcraft Traditions, Rituals & Spiritual Meaning" },
  { id: "Jx6WxNy3iFU", date: "2025-10-07", kind: "video", title: "🌜Yulia Moon Show🌙 Full Moon in Aries🔥 Full Moon Magic🔥  Moon Connection" },
  { id: "6idz3v9MfIs", date: "2025-09-27", kind: "video", title: "🔮 The Yulia Moon Show | Ep.3 – Witchy Q&A: Answering Your Questions & Busting Misconceptions 🌙" },
  { id: "zl6Gw7NNnHs", date: "2025-09-20", kind: "video", title: "🔮 The Yulia Moon Show | Ep.2 – Magical Tools & Tarot Energy Explained 🌙" },
  { id: "BDtBsFXdlXI", date: "2025-09-12", kind: "video", title: "🔮 The Yulia Moon Show | Ep.1 – Beginner’s Guide to Witchcraft – Tarot, Magic & Energy Work 🌙" },
];
