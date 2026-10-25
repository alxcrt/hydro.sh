import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import "dotenv/config";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth";
import { createContext } from "./lib/context";
import { generateOGImage } from "./lib/og";
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

const MAX_WEBHOOK_BODY_BYTES = 1024 * 1024;

async function readWebhookBody(request: Request): Promise<string | null> {
	const reader = request.body?.getReader();
	if (!reader) return "";

	const chunks: Uint8Array[] = [];
	let total = 0;
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			total += value.byteLength;
			if (total > MAX_WEBHOOK_BODY_BYTES) {
				await reader.cancel().catch(() => undefined);
				return null;
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}

	const bytes = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return new TextDecoder().decode(bytes);
}

app.post("/api/stripe/webhook", async (c) => {
	const signature = c.req.header("stripe-signature");
	if (!signature) {
		return c.json({ error: "Missing stripe-signature header" }, 400);
	}

	const declaredLength = Number(c.req.header("content-length"));
	if (declaredLength > MAX_WEBHOOK_BODY_BYTES) {
		return c.json({ error: "Webhook body too large" }, 413);
	}
	const body = await readWebhookBody(c.req.raw);
	if (body === null) {
		return c.json({ error: "Webhook body too large" }, 413);
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

let cachedOGImage: Uint8Array | null = null;

app.get("/api/og", async (c) => {
	try {
		if (!cachedOGImage) {
			cachedOGImage = await generateOGImage();
		}
		return c.body(new Uint8Array(cachedOGImage), 200, {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=86400, s-maxage=86400",
		});
	} catch (err) {
		console.error("OG image generation failed:", err);
		return c.json({ error: String(err) }, 500);
	}
});

app.get("/", (c) => {
	return c.text("OK");
});

export default {
	port: 3001,
	fetch: app.fetch,
};
