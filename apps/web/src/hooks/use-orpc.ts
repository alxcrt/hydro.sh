import type { appRouter } from "@hydro.sh/server/src/routers";
import type { RouterUtils } from "@orpc/react-query";
import type { RouterClient } from "@orpc/server";
import * as React from "react";

type ORPCReactUtils = RouterUtils<RouterClient<typeof appRouter>>;

export const ORPCContext = React.createContext<ORPCReactUtils | undefined>(
	undefined,
);

export function useORPC(): ORPCReactUtils {
	const orpc = React.use(ORPCContext);
	if (!orpc) {
		throw new Error("ORPCContext is not set up properly");
	}
	return orpc;
}
