import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		CORS_ORIGIN: z.string().url().optional(),
		DATABASE_URL: z.string(),
		BETTER_AUTH_SECRET: z.string(),
		// DOMAIN is only required in production environment
		// Used for cross-subdomain cookies
		// in auth.ts
		DOMAIN:
			process.env.NODE_ENV === "production"
				? z.string()
				: z.string().optional(),
		RESEND_API_KEY: z.string(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
