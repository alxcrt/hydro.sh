import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { protectedProcedure } from "@/lib/orpc";
import {
	CreateDeviceSchema,
	DeleteDeviceSchema,
	UpdateDeviceSchema,
} from "@hydro.sh/schemas/devices";
import z from "zod";

export const devicesRouter = {
	list: protectedProcedure.handler(async ({ context }) => {
		const devices = await db.query.device.findMany({
			where: eq(schema.device.userId, context.session.user.id),
		});

		if (!devices) {
			return [];
		}

		return devices;
	}),

	create: protectedProcedure
		.input(CreateDeviceSchema)
		.handler(async ({ context, input }) => {
			try {
				// Check if device already exists
				const existingDevice = await db.query.device.findFirst({
					where: eq(schema.device.deviceIdentifier, input.deviceIdentifier),
				});

				if (existingDevice) {
					throw new ORPCError("Device already registered");
				}

				const device = await db
					.insert(schema.device)
					.values({
						id: crypto.randomUUID(),
						name: input.name,
						bluetoothName: input.bluetoothName,
						deviceIdentifier: input.deviceIdentifier,
						lastConnected: new Date(),
						userId: context.session.user.id,
					})
					.returning();

				return device[0];
			} catch (error) {
				console.error("Error creating device:", error);
				if (error instanceof ORPCError) {
					throw error;
				}
				throw new ORPCError("Failed to create device");
			}
		}),

	update: protectedProcedure
		.input(UpdateDeviceSchema)
		.handler(async ({ context, input }) => {
			// Check if device exists and belongs to user
			const existingDevice = await db.query.device.findFirst({
				where: (devices, { and, eq }) =>
					and(
						eq(devices.id, input.id),
						eq(devices.userId, context.session.user.id),
					),
			});

			if (!existingDevice) {
				throw new ORPCError("Device not found or not authorized");
			}

			const updateData: Partial<typeof schema.device.$inferInsert> = {};

			if (input.name) {
				updateData.name = input.name;
			}

			if (input.bluetoothName) {
				updateData.bluetoothName = input.bluetoothName;
			}

			// Always update the lastConnected timestamp
			updateData.lastConnected = new Date();
			updateData.updatedAt = new Date();

			const device = await db
				.update(schema.device)
				.set(updateData)
				.where(eq(schema.device.id, input.id))
				.returning();

			return device[0];
		}),

	delete: protectedProcedure
		.input(DeleteDeviceSchema)
		.handler(async ({ context, input }) => {
			const device = await db
				.delete(schema.device)
				.where(eq(schema.device.id, input.id));
			return device;
		}),
};
