import { z } from "zod";

export const CreateWaterIntakeSchema = z.object({
	amount: z.number(),
	timestamp: z.date(),
	bottleBrand: z.string(),
	source: z.enum(["bottle", "manual"]),
});

export const ListWaterIntakesSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
		startDate: z.date().optional(),
		endDate: z.date().optional(),
	})
	.optional();
