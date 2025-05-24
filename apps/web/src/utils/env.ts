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
	server: {
		// Polar API authentication token
		POLAR_ACCESS_TOKEN: z.string({
			required_error: "Polar access token is required",
		}),
		// Determines which Polar environment to use (sandbox for testing, production for live)
		POLAR_ENVIRONMENT: z.enum(["sandbox", "production"]).default("sandbox"),
	},
	// Prefix required for client-side environment variables
	clientPrefix: "VITE_",
	// Client-side environment variables (exposed to the browser)
	client: {
		// URL for API requests
		VITE_SERVER_URL: z.string().url(),
		// Google OAuth client ID for authentication
		VITE_GOOGLE_CLIENT_ID: z.string(),
	},
	// Maps environment variable names to their actual sources
	runtimeEnv: {
		POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
		POLAR_ENVIRONMENT: process.env.POLAR_ENVIRONMENT,
		VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL,
		VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
	},
	// Treats empty strings as undefined for validation purposes
	emptyStringAsUndefined: true,
});
