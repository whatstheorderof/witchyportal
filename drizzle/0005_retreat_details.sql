ALTER TABLE "retreats" ADD COLUMN "duration" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "retreats" ADD COLUMN "meals" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "retreats" ADD COLUMN "travel" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "retreats" ADD COLUMN "for_me" jsonb DEFAULT '[]'::jsonb NOT NULL;