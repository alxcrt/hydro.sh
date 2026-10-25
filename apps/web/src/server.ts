import entry from "@tanstack/react-start/server-entry";
import { appendLegacyAuthCookieExpirations } from "./legacy-auth-cookies";

const fetch: typeof entry.fetch = async (...args) => {
	const response = await entry.fetch(...args);
	if (import.meta.env.VITE_SERVER_URL !== "https://api.hydro.alexcretu.com")
		return response;
	return appendLegacyAuthCookieExpirations(
		response,
		args[0].headers.get("Cookie"),
	);
};

export default { fetch };
