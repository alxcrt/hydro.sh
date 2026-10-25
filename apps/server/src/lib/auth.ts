// import { Resend } from "resend";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/utils/env";
import { db } from "../db";
import * as schema from "../db/schema/auth";
import { authCookieConfig } from "./auth-cookies";

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
	advanced: authCookieConfig({
		production: process.env.NODE_ENV === "production",
		domain: env.DOMAIN,
		frontendOrigin: env.CORS_ORIGIN,
		apiUrl: env.BETTER_AUTH_URL,
	}),
});
