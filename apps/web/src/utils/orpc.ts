import type { appRouter } from "@hydro.sh/server/src/routers";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCReactQueryUtils } from "@orpc/react-query";
import type { RouterClient } from "@orpc/server";

import { env } from "./env";

export const link = new RPCLink({
	url: `${env.VITE_SERVER_URL}/rpc`,
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: "include",
		});
	},
});

export const client: RouterClient<typeof appRouter> = createORPCClient(link);

export const orpc = createORPCReactQueryUtils(client);
