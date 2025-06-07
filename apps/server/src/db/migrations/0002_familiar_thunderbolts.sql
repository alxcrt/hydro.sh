CREATE TABLE "water_intake" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"bottle_brand" text NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "water_intake" ADD CONSTRAINT "water_intake_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;