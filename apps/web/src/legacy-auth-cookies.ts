import { legacyAuthCookieExpirations } from "../../server/src/lib/auth-cookies";

export function appendLegacyAuthCookieExpirations(
	response: Response,
	cookieHeader: string | null,
): Response {
	const expirations = legacyAuthCookieExpirations(cookieHeader ?? undefined);
	if (expirations.length === 0) return response;
	const headers = new Headers(response.headers);
	for (const cookie of expirations) headers.append("Set-Cookie", cookie);
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}
