import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		CORS_ORIGIN: z.string().url().optional(),
		DATABASE_URL: z.string(),
		BETTER_AUTH_SECRET: z.string(),
	},
	runtimeEnv: {
		CORS_ORIGIN: process.env.CORS_ORIGIN,
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
	},
	emptyStringAsUndefined: true,
});
