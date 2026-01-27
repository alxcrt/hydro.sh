// import { Resend } from "resend";

import { env } from "@/utils/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";

// const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins: [env.CORS_ORIGIN || ""],
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		// requireEmailVerification: true,
	},
	// emailVerification: {
	// 	sendVerificationEmail: async ({ user, url, token }) => {
	// 		const { data, error } = await resend.emails.send({
	// 			from: "Hydro <onboarding@resend.dev>",
	// 			to: user.email,
	// 			subject: "Verify your email",
	// 			html: `<p>Click <a href="${url}">here</a> to verify your email</p>`,
	// 		});

	// 		if (error) {
	// 			console.error(error);
	// 		}

	// 		// return data;
	// 	},
	// 	sendOnSignUp: true,
	// 	autoSignInAfterVerification: true,
	// 	expiresIn: 3600, // 1 hour
	// },
	// The advanced configuration allows for fine-tuning of auth cookie behavior
	advanced: {
		// Sets a prefix for all auth cookies to prevent naming conflicts
		cookiePrefix: "hydro.sh",

		// Apply production-specific cookie settings
		...(process.env.NODE_ENV === "production"
			? {
					// Enable cookies to work across subdomains (e.g., app.screenshothis.com, api.screenshothis.com)
					crossSubDomainCookies: {
						enabled: true,
						// domain: ".alexcretu.com",
						domain: `.${env.DOMAIN}`, // Apply cookies to all subdomains of the domain
					},
					// Configure security attributes for cookies in production
					defaultCookieAttributes: {
						secure: true, // Cookies only sent over HTTPS
						httpOnly: true, // Prevents JavaScript access to cookies
						sameSite: "none", // Allows cross-origin requests (needed for API/frontend separation)
						partitioned: true, // Uses partitioned cookies for privacy (CHIPS)
					},
				}
			: {}), // In development, use better-auth defaults without these restrictions
	},
});
