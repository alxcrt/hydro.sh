import { describe, expect, test } from "bun:test";
import { appendLegacyAuthCookieExpirations } from "./legacy-auth-cookies";

describe("frontend legacy cookie cleanup", () => {
	test("expires broad cookies on the first page response without losing its headers", async () => {
		const response = new Response("page", {
			status: 200,
			headers: {
				"Set-Cookie": "other=value; Path=/; Secure",
				"Content-Type": "text/html",
			},
		});
		const cleaned = appendLegacyAuthCookieExpirations(
			response,
			"__Secure-hydro.sh.session_token=old",
		);
		expect(await cleaned.text()).toBe("page");
		expect(cleaned.headers.get("Content-Type")).toBe("text/html");
		expect(cleaned.headers.getSetCookie()).toHaveLength(3);
		expect(cleaned.headers.getSetCookie()[0]).toContain("other=value");
	});

	test("leaves responses without old cookies intact", () => {
		const response = new Response("page");
		expect(appendLegacyAuthCookieExpirations(response, null)).toBe(response);
	});
});
