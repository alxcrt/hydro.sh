import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import "dotenv/config";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth";
import { createContext } from "./lib/context";
import { stripe } from "./lib/stripe";
import { appRouter } from "./routers/index";
import { env } from "./utils/env";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		// Set the allowed origin for CORS requests
		// This controls which domains can access our API
		// CORS_ORIGIN is loaded from environment variables
		origin: env.CORS_ORIGIN || "",

		// Define which HTTP methods are allowed for cross-origin requests
		allowMethods: ["GET", "POST", "OPTIONS"],

		// Specify which headers can be included in cross-origin requests
		// Content-Type: For specifying data format (JSON, form data, etc.)
		// Authorization: For authentication tokens
		allowHeaders: ["Content-Type", "Authorization"],

		// Allow cookies and authorization headers to be sent with requests
		// This is important for authenticated requests across origins
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.post("/api/stripe/webhook", async (c) => {
	const body = await c.req.text();
	const signature = c.req.header("stripe-signature");

	if (!signature) {
		return c.json({ error: "Missing stripe-signature header" }, 400);
	}

	try {
		const event = await stripe.webhooks.constructEventAsync(
			body,
			signature,
			env.STRIPE_WEBHOOK_SECRET,
		);

		if (event.type === "checkout.session.completed") {
			const session = event.data.object;
			console.log("Donation received:", {
				amount: session.amount_total,
				message: session.metadata?.message,
			});
		}

		return c.json({ received: true }, 200);
	} catch (err) {
		console.error("Webhook signature verification failed:", err);
		return c.json({ error: "Webhook signature verification failed" }, 400);
	}
});

const handler = new RPCHandler(appRouter);
app.use("/rpc/*", async (c, next) => {
	const context = await createContext({ context: c });
	const { matched, response } = await handler.handle(c.req.raw, {
		prefix: "/rpc",
		context: context,
	});
	if (matched) {
		return c.newResponse(response.body, response);
	}
	await next();
});

app.get("/", (c) => {
	return c.text("OK");
});

export default {
	port: 3001,
	fetch: app.fetch,
};
