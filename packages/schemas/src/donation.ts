import { z } from "zod";

export const CreateDonationSchema = z.object({
	amount: z.number().int().positive(),
	message: z.string().optional(),
});
