CREATE TABLE "device" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"bluetooth_name" text NOT NULL,
	"device_identifier" text NOT NULL,
	"last_connected" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "device_device_identifier_unique" UNIQUE("device_identifier")
);
--> statement-breakpoint
ALTER TABLE "device" ADD CONSTRAINT "device_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;