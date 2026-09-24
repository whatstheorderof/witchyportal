CREATE TYPE "public"."availability" AS ENUM('available', 'limited', 'waitlist', 'sold_out', 'closed');--> statement-breakpoint
CREATE TYPE "public"."inbox_status" AS ENUM('new', 'handled', 'archived');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('deposit', 'full');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('article', 'tip', 'affirmation', 'astrology');--> statement-breakpoint
CREATE TYPE "public"."publish_status" AS ENUM('draft', 'scheduled', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."video_kind" AS ENUM('video', 'short');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"password_hash" text NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "booking_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"departure_id" uuid NOT NULL,
	"label" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"payment_type" "payment_type" DEFAULT 'full' NOT NULL,
	"amount" integer NOT NULL,
	"total_price" integer,
	"currency" text DEFAULT 'GBP' NOT NULL,
	"balance_note" text,
	"availability" "availability" DEFAULT 'available' NOT NULL,
	"payment_url" text,
	"test_payment_url" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checkout_clicks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"option_id" uuid,
	"retreat_title" text NOT NULL,
	"option_label" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"environment" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"retreat_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"label" text,
	"availability" "availability" DEFAULT 'available' NOT NULL,
	"availability_note" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"topic" text DEFAULT 'general' NOT NULL,
	"retreat_id" uuid,
	"message" text NOT NULL,
	"status" "inbox_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"retreat_id" uuid,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_placeholder" boolean DEFAULT false NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"publish_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "highlights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"eyebrow" text DEFAULT '' NOT NULL,
	"title" text NOT NULL,
	"text" text DEFAULT '' NOT NULL,
	"href" text DEFAULT '/' NOT NULL,
	"media_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"publish_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"success" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"pathname" text,
	"kind" "media_kind" DEFAULT 'image' NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"caption" text,
	"width" integer,
	"height" integer,
	"poster_url" text,
	"is_placeholder" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"is_placeholder" boolean DEFAULT true NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"publish_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "post_type" NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"topic" text DEFAULT '' NOT NULL,
	"period" text,
	"cover_media_id" uuid,
	"is_placeholder" boolean DEFAULT false NOT NULL,
	"seo_description" text,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"publish_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "retreats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"concept" text DEFAULT '' NOT NULL,
	"personal_message" text DEFAULT '' NOT NULL,
	"guest_experience" text DEFAULT '' NOT NULL,
	"activities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"itinerary" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"inclusions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"exclusions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"accommodation" text DEFAULT '' NOT NULL,
	"terms" text DEFAULT '' NOT NULL,
	"hero_media_id" uuid,
	"gallery" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"video_url" text,
	"is_placeholder" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"publish_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "retreats_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"source" text DEFAULT 'site' NOT NULL,
	"consent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"youtube_id" text NOT NULL,
	"kind" "video_kind" DEFAULT 'video' NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"topic" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_placeholder" boolean DEFAULT false NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"publish_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"retreat_id" uuid,
	"departure_id" uuid,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"note" text,
	"status" "inbox_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booking_options" ADD CONSTRAINT "booking_options_departure_id_departures_id_fk" FOREIGN KEY ("departure_id") REFERENCES "public"."departures"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkout_clicks" ADD CONSTRAINT "checkout_clicks_option_id_booking_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."booking_options"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departures" ADD CONSTRAINT "departures_retreat_id_retreats_id_fk" FOREIGN KEY ("retreat_id") REFERENCES "public"."retreats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_retreat_id_retreats_id_fk" FOREIGN KEY ("retreat_id") REFERENCES "public"."retreats"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_retreat_id_retreats_id_fk" FOREIGN KEY ("retreat_id") REFERENCES "public"."retreats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retreats" ADD CONSTRAINT "retreats_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_retreat_id_retreats_id_fk" FOREIGN KEY ("retreat_id") REFERENCES "public"."retreats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_departure_id_departures_id_fk" FOREIGN KEY ("departure_id") REFERENCES "public"."departures"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "options_departure_idx" ON "booking_options" USING btree ("departure_id");--> statement-breakpoint
CREATE INDEX "departures_retreat_idx" ON "departures" USING btree ("retreat_id");--> statement-breakpoint
CREATE INDEX "login_attempts_key_idx" ON "login_attempts" USING btree ("key","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_type_slug_idx" ON "posts" USING btree ("type","slug");--> statement-breakpoint
CREATE INDEX "posts_public_idx" ON "posts" USING btree ("type","status","publish_at");