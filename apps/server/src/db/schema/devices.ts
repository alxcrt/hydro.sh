import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const device = pgTable("device", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	bluetoothName: text("bluetooth_name").notNull(),
	deviceIdentifier: text("device_identifier").notNull().unique(),
	lastConnected: timestamp("last_connected"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});
