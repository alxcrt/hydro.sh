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

export const WaterIntakeSummarySchema = z
	.object({
		startDate: z.date(),
		endDate: z.date(),
	})
	.refine(({ startDate, endDate }) => startDate <= endDate, {
		message: "Start date must not be after end date",
	});
