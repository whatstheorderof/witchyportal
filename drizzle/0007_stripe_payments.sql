CREATE TYPE "public"."checkout_method" AS ENUM('link', 'stripe');--> statement-breakpoint
CREATE TYPE "public"."order_kind" AS ENUM('retreat', 'synastry');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'expired', 'cancelled', 'refunded', 'needs_attention');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "order_kind" NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"mode" text NOT NULL,
	"stripe_session_id" text,
	"stripe_payment_intent" text,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"description" text NOT NULL,
	"option_id" uuid,
	"quantity" integer DEFAULT 1 NOT NULL,
	"input_hash" text,
	"name" text,
	"email" text,
	"phone" text,
	"expires_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
CREATE TABLE "stripe_events" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booking_options" ADD COLUMN "checkout_method" "checkout_method" DEFAULT 'link' NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_options" ADD COLUMN "capacity" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_option_id_booking_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."booking_options"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "orders_option_idx" ON "orders" USING btree ("option_id");--> statement-breakpoint
CREATE INDEX "orders_hash_idx" ON "orders" USING btree ("input_hash");--> statement-breakpoint
CREATE INDEX "orders_created_idx" ON "orders" USING btree ("created_at");