import type { MiddlewareHandler } from "hono";
import { generateCookie } from "hono/cookie";

const LEGACY_COOKIE_DOMAIN = ".alexcretu.com";
const NARROW_COOKIE_DOMAIN = "hydro.alexcretu.com";
const LEGACY_COOKIE_NAME =
	/^(?:__Secure-)?hydro\.sh\.(?:session_token|session_data|account_data|dont_remember|oauth_state|state)(?:\.\d+)?$/;

interface AuthCookieConfigInput {
	production: boolean;
	domain?: string;
	frontendOrigin?: string;
	apiUrl?: string;
}

function parseOrigin(value: string | undefined, name: string): URL {
	if (!value) throw new Error(`${name} is required in production`);
	const url = new URL(value);
	if (url.origin !== value)
		throw new Error(
			`${name} must be an origin without a path or trailing slash`,
		);
	return url;
}

export function authCookieConfig({
	production,
	domain,
	frontendOrigin,
	apiUrl,
}: AuthCookieConfigInput) {
	if (!production) return { cookiePrefix: "hydro.sh" };

	if (!domain || domain.startsWith("."))
		throw new Error("DOMAIN must be a bare hostname in production");
	const frontend = parseOrigin(frontendOrigin, "CORS_ORIGIN");
	const api = parseOrigin(apiUrl, "BETTER_AUTH_URL");
	if (domain === "localhost") {
		// The isolated production-image fixture uses loopback URLs.
		const loopback = new Set(["localhost", "127.0.0.1"]);
		if (!loopback.has(frontend.hostname) || !loopback.has(api.hostname))
			throw new Error("DOMAIN=localhost requires loopback origins");
	} else if (
		frontend.protocol !== "https:" ||
		api.protocol !== "https:" ||
		frontend.hostname !== domain ||
		!api.hostname.endsWith(`.${domain}`)
	) {
		throw new Error(
			"Production auth requires an HTTPS frontend at DOMAIN and an HTTPS API below DOMAIN",
		);
	}

	return {
		// A new name prevents ambiguity with the old parent-domain cookie on cutover.
		cookiePrefix: "hydro.sh.v2",
		crossSubDomainCookies: { enabled: true, domain: `.${domain}` },
		defaultCookieAttributes: {
			secure: true,
			httpOnly: true,
			sameSite: "none" as const,
			partitioned: true,
		},
	};
}

export function legacyAuthCookieExpirations(cookieHeader?: string): string[] {
	if (!cookieHeader) return [];
	const names = new Set<string>();
	for (const pair of cookieHeader.split(";")) {
		const equals = pair.indexOf("=");
		if (equals < 0) continue;
		const name = pair.slice(0, equals).trim();
		if (LEGACY_COOKIE_NAME.test(name)) names.add(name);
	}
	return [...names]
		.sort(
			(left, right) =>
				Number(right.includes("session_token")) -
				Number(left.includes("session_token")),
		)
		.slice(0, 16)
		.flatMap((name) =>
			[true, false].map((partitioned) =>
				generateCookie(name, "", {
					domain: LEGACY_COOKIE_DOMAIN,
					path: "/",
					maxAge: 0,
					expires: new Date(0),
					secure: true,
					httpOnly: true,
					sameSite: "none",
					partitioned,
				}),
			),
		);
}

export const expireLegacyAuthCookies: MiddlewareHandler = async (
	context,
	next,
) => {
	await next();
	for (const cookie of legacyAuthCookieExpirations(
		context.req.header("Cookie"),
	)) {
		context.header("Set-Cookie", cookie, { append: true });
	}
};

export function shouldExpireLegacyAuthCookies(
	production: boolean,
	domain?: string,
) {
	return production && domain === NARROW_COOKIE_DOMAIN;
}
