import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const waterIntake = pgTable("water_intake", {
	id: text("id").primaryKey(),
	amount: text("amount").notNull(),
	timestamp: timestamp("timestamp").notNull().defaultNow(),
	bottleBrand: text("bottle_brand").notNull(),
	source: text("source").notNull(), // "bottle" or "manual"
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});
