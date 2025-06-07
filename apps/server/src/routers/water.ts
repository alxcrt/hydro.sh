import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { protectedProcedure } from "@/lib/orpc";
import {
	CreateWaterIntakeSchema,
	ListWaterIntakesSchema,
} from "@hydro.sh/schemas/water";

export const waterRouter = {
	list: protectedProcedure
		.input(ListWaterIntakesSchema)
		.handler(async ({ context, input }) => {
			const limit = input?.limit ?? 5;
			const offset = input?.offset ?? 0;

			const waterIntakes = await db.query.waterIntake.findMany({
				where: eq(schema.waterIntake.userId, context.session.user.id),
				orderBy: (waterIntake, { desc }) => [desc(waterIntake.timestamp)],
				limit,
				offset,
			});

			if (!waterIntakes) {
				return [];
			}

			return waterIntakes;
		}),

	create: protectedProcedure
		.input(CreateWaterIntakeSchema)
		.handler(async ({ context, input }) => {
			try {
				const waterIntake = await db
					.insert(schema.waterIntake)
					.values({
						id: uuidv4(),
						amount: input.amount.toString(),
						timestamp: input.timestamp || new Date(),
						bottleBrand: input.bottleBrand,
						source: input.source,
						userId: context.session.user.id,
					})
					.returning();

				return waterIntake[0];
			} catch (error) {
				console.error("Error creating water intake:", error);
				if (error instanceof ORPCError) {
					throw error;
				}
				throw new ORPCError("Failed to create water intake record");
			}
		}),
};
