import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  index,
  uuid,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Enums                                                               */
/* ------------------------------------------------------------------ */

/** Editorial lifecycle shared by every publishable record. */
export const publishStatus = pgEnum("publish_status", [
  "draft",
  "scheduled",
  "published",
  "archived",
]);

/** Manually managed availability (see docs/BOOKINGS.md). */
export const availability = pgEnum("availability", [
  "available",
  "limited",
  "waitlist",
  "sold_out",
  "closed",
]);

export const paymentType = pgEnum("payment_type", ["deposit", "full"]);

export const postType = pgEnum("post_type", [
  "article",
  "tip",
  "affirmation",
  "motivation",
  "astrology",
]);

export const videoKind = pgEnum("video_kind", ["video", "short"]);
export const mediaKind = pgEnum("media_kind", ["image", "video"]);
export const inboxStatus = pgEnum("inbox_status", ["new", "handled", "archived"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

const publishing = {
  status: publishStatus("status").default("draft").notNull(),
  /** When status = scheduled, becomes public at this instant. */
  publishAt: timestamp("publish_at", { withTimezone: true }),
};

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
});

export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: text("key").notNull(),
    success: boolean("success").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("login_attempts_key_idx").on(t.key, t.createdAt)],
);

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  /** Blob pathname, used for deletion. Null for bundled/static assets. */
  pathname: text("pathname"),
  kind: mediaKind("kind").default("image").notNull(),
  alt: text("alt").notNull().default(""),
  caption: text("caption"),
  width: integer("width"),
  height: integer("height"),
  /** Poster image for videos */
  posterUrl: text("poster_url"),
  /** True for supplied starter photos or stand-ins to be replaced */
  isPlaceholder: boolean("is_placeholder").default(false).notNull(),
  ...timestamps,
});

/* ------------------------------------------------------------------ */
/* Retreats → departures → booking options                             */
/* ------------------------------------------------------------------ */

export type Activity = { title: string; description: string };
export type ItineraryDay = { day: string; title: string; description: string };

export const retreats = pgTable("retreats", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull().default(""),
  location: text("location").notNull().default(""),
  country: text("country").notNull().default(""),
  summary: text("summary").notNull().default(""),
  concept: text("concept").notNull().default(""),
  personalMessage: text("personal_message").notNull().default(""),
  guestExperience: text("guest_experience").notNull().default(""),
  /** "What you'll take home" — what Yulia hopes guests gain, one per line */
  benefits: jsonb("benefits").$type<string[]>().default([]).notNull(),
  activities: jsonb("activities").$type<Activity[]>().default([]).notNull(),
  itinerary: jsonb("itinerary").$type<ItineraryDay[]>().default([]).notNull(),
  inclusions: jsonb("inclusions").$type<string[]>().default([]).notNull(),
  exclusions: jsonb("exclusions").$type<string[]>().default([]).notNull(),
  accommodation: text("accommodation").notNull().default(""),
  terms: text("terms").notNull().default(""),
  heroMediaId: uuid("hero_media_id").references(() => media.id, { onDelete: "set null" }),
  gallery: jsonb("gallery").$type<string[]>().default([]).notNull(),
  /** Optional YouTube URL shown in the gallery */
  videoUrl: text("video_url"),
  isPlaceholder: boolean("is_placeholder").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  ...publishing,
  ...timestamps,
});

export const departures = pgTable(
  "departures",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    retreatId: uuid("retreat_id")
      .notNull()
      .references(() => retreats.id, { onDelete: "cascade" }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    label: text("label"),
    availability: availability("availability").default("available").notNull(),
    /** Free-text shown to guests, e.g. "4 places left" (manually maintained) */
    availabilityNote: text("availability_note"),
    isVisible: boolean("is_visible").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    ...timestamps,
  },
  (t) => [index("departures_retreat_idx").on(t.retreatId)],
);

export const bookingOptions = pgTable(
  "booking_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    departureId: uuid("departure_id")
      .notNull()
      .references(() => departures.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    description: text("description").notNull().default(""),
    paymentType: paymentType("payment_type").default("full").notNull(),
    /** Amount charged by the payment link, in minor units (pence/cents). */
    amount: integer("amount").notNull(),
    /** Full price of the place, minor units — shown alongside deposits. */
    totalPrice: integer("total_price"),
    currency: text("currency").default("GBP").notNull(),
    /** e.g. "Balance due 60 days before arrival" */
    balanceNote: text("balance_note"),
    availability: availability("availability").default("available").notNull(),
    /** Live hosted payment link — used in production only. */
    paymentUrl: text("payment_url"),
    /** Test-mode payment link — used in previews/development. */
    testPaymentUrl: text("test_payment_url"),
    isVisible: boolean("is_visible").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    ...timestamps,
  },
  (t) => [index("options_departure_idx").on(t.departureId)],
);

/** Logged when a visitor is sent to a payment page. NOT a confirmed booking. */
export const checkoutClicks = pgTable("checkout_clicks", {
  id: uuid("id").defaultRandom().primaryKey(),
  optionId: uuid("option_id").references(() => bookingOptions.id, { onDelete: "set null" }),
  retreatTitle: text("retreat_title").notNull(),
  optionLabel: text("option_label").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  environment: text("environment").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ------------------------------------------------------------------ */
/* Editorial content                                                    */
/* ------------------------------------------------------------------ */

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: postType("type").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    /** Markdown */
    body: text("body").notNull().default(""),
    topic: text("topic").notNull().default(""),
    /** Astrology: season / period label, e.g. "Libra season 2026" */
    period: text("period"),
    coverMediaId: uuid("cover_media_id").references(() => media.id, { onDelete: "set null" }),
    isPlaceholder: boolean("is_placeholder").default(false).notNull(),
    seoDescription: text("seo_description"),
    ...publishing,
    ...timestamps,
  },
  (t) => [
    uniqueIndex("posts_type_slug_idx").on(t.type, t.slug),
    index("posts_public_idx").on(t.type, t.status, t.publishAt),
  ],
);

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  youtubeId: text("youtube_id").notNull(),
  kind: videoKind("kind").default("video").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  topic: text("topic").notNull().default(""),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPlaceholder: boolean("is_placeholder").default(false).notNull(),
  /** "manual" or "channel" (imported from the YouTube channel feed) */
  source: text("source").notNull().default("manual"),
  ...publishing,
  ...timestamps,
}, (t) => [uniqueIndex("videos_youtube_id_idx").on(t.youtubeId)]);

export const faqs = pgTable("faqs", {
  id: uuid("id").defaultRandom().primaryKey(),
  /** Null = general FAQ shown on Contact */
  retreatId: uuid("retreat_id").references(() => retreats.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPlaceholder: boolean("is_placeholder").default(false).notNull(),
  ...publishing,
  ...timestamps,
});

/** Editorial cards on the homepage ("Homepage features"). */
export const highlights = pgTable("highlights", {
  id: uuid("id").defaultRandom().primaryKey(),
  eyebrow: text("eyebrow").notNull().default(""),
  title: text("title").notNull(),
  text: text("text").notNull().default(""),
  href: text("href").notNull().default("/"),
  mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
  sortOrder: integer("sort_order").default(0).notNull(),
  ...publishing,
  ...timestamps,
});

/** Policy and static pages (privacy, terms, booking terms, cookies). */
export const pages = pgTable("pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  isPlaceholder: boolean("is_placeholder").default(true).notNull(),
  ...publishing,
  ...timestamps,
});

/** Key/value site settings: homepage hero, about page, contact details. */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

/* ------------------------------------------------------------------ */
/* Submissions                                                          */
/* ------------------------------------------------------------------ */

export const enquiries = pgTable("enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  topic: text("topic").notNull().default("general"),
  retreatId: uuid("retreat_id").references(() => retreats.id, { onDelete: "set null" }),
  message: text("message").notNull(),
  status: inboxStatus("status").default("new").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const waitlist = pgTable("waitlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  retreatId: uuid("retreat_id").references(() => retreats.id, { onDelete: "cascade" }),
  departureId: uuid("departure_id").references(() => departures.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  note: text("note"),
  status: inboxStatus("status").default("new").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  source: text("source").notNull().default("site"),
  consentAt: timestamp("consent_at", { withTimezone: true }).defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Retreat = typeof retreats.$inferSelect;
export type Departure = typeof departures.$inferSelect;
export type BookingOption = typeof bookingOptions.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Media = typeof media.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Highlight = typeof highlights.$inferSelect;
export type Page = typeof pages.$inferSelect;
