import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCReactQueryUtils } from "@orpc/react-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { appRouter } from "../../../server/src/routers/index";
import type { RouterClient } from "@orpc/server";
import { createContext, use } from 'react'
import type { RouterUtils } from '@orpc/react-query'

type ORPCReactUtils = RouterUtils<RouterClient<typeof appRouter>>

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: "retry",
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});

export const link = new RPCLink({
  url: `${import.meta.env.VITE_SERVER_URL}/rpc`,
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },
});

export const client: RouterClient<typeof appRouter> = createORPCClient(link)

export const orpc = createORPCReactQueryUtils(client)


export const ORPCContext = createContext<ORPCReactUtils | undefined>(undefined)

export function useORPC(): ORPCReactUtils {
  const orpc = use(ORPCContext)
  if (!orpc) {
    throw new Error('ORPCContext is not set up properly')
  }
  return orpc
}
