import { describe, expect, test } from "bun:test";
import Stripe from "stripe";

process.env.NODE_ENV = "test";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.DATABASE_URL = "postgresql://fixture:fixture@127.0.0.1:1/hydro";
process.env.BETTER_AUTH_SECRET =
	"isolated-test-auth-secret-with-sufficient-length";
process.env.BETTER_AUTH_URL = "http://localhost:3001";
process.env.RESEND_API_KEY = "re_fixture";
process.env.GOOGLE_CLIENT_ID = "fixture.apps.googleusercontent.com";
process.env.GOOGLE_CLIENT_SECRET = "fixture";
process.env.STRIPE_SECRET_KEY = "sk_test_fixture";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_fixture";
process.env.STRIPE_PUBLISHABLE_KEY = "pk_test_fixture";

const { default: api } = await import("./index");
const stripe = new Stripe("sk_test_fixture");
const url = "http://localhost:3001/api/stripe/webhook";

async function signedRequest(body: string, contentLength?: string) {
	const signature = await stripe.webhooks.generateTestHeaderStringAsync({
		payload: body,
		secret: "whsec_fixture",
	});
	return new Request(url, {
		method: "POST",
		body,
		headers: {
			"content-type": "application/json",
			"stripe-signature": signature,
			...(contentLength ? { "content-length": contentLength } : {}),
		},
	});
}

describe("Stripe webhook body boundary", () => {
	test("does not consume an unsigned request body", async () => {
		let reads = 0;
		const body = new ReadableStream<Uint8Array>(
			{
				pull(controller) {
					reads += 1;
					controller.enqueue(new TextEncoder().encode("unsigned"));
					controller.close();
				},
			},
			{ highWaterMark: 0 },
		);
		const response = await api.fetch(
			new Request(url, {
				method: "POST",
				body,
				duplex: "half",
			} as RequestInit & { duplex: "half" }),
		);
		expect(response.status).toBe(400);
		expect(reads).toBe(0);
	});

	test("rejects a missing signature before reading a large body", async () => {
		const response = await api.fetch(
			new Request(url, { method: "POST", body: "x".repeat(1024 * 1024 + 1) }),
		);
		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({
			error: "Missing stripe-signature header",
		});
	});

	test("rejects oversized bodies even with a false short content length", async () => {
		const response = await api.fetch(
			await signedRequest("x".repeat(1024 * 1024 + 1), "1"),
		);
		expect(response.status).toBe(413);
	});

	test("accepts a small correctly signed event", async () => {
		const event = JSON.stringify({
			id: "evt_fixture",
			object: "event",
			type: "ping",
			data: { object: {} },
		});
		const response = await api.fetch(await signedRequest(event));
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ received: true });
	});
});
