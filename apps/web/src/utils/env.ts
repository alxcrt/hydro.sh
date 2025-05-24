import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Environment variable configuration and validation
 *
 * This module uses @t3-oss/env-core to provide type-safe access to environment variables
 * with runtime validation. It ensures that all required variables are present and correctly
 * formatted before the application starts.
 *
 * - Server variables are accessed directly from process.env
 * - Client variables must be prefixed with VITE_ to be exposed to the browser
 */
export const env = createEnv({
	// Server-side environment variables (not exposed to the client)
	server: {},
	// Prefix required for client-side environment variables
	clientPrefix: "VITE_",
	// Client-side environment variables (exposed to the browser)
	client: {
		// URL for API requests
		VITE_SERVER_URL: z.string().url(),
	},
	// Maps environment variable names to their actual sources
	runtimeEnv: {
		VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL,
	},
	// Treats empty strings as undefined for validation purposes
	emptyStringAsUndefined: true,
});
