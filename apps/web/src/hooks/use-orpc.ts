import * as React from "react";
import type { orpc } from "../utils/orpc";

type ORPCReactUtils = typeof orpc;

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
