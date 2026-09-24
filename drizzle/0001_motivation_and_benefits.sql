ALTER TYPE "public"."post_type" ADD VALUE 'motivation' BEFORE 'astrology';--> statement-breakpoint
ALTER TABLE "retreats" ADD COLUMN "benefits" jsonb DEFAULT '[]'::jsonb NOT NULL;