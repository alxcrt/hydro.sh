import "./app.css";
import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import React from "react";
import { toast } from "sonner";
import Loader from "./components/loader";
import { NotFound } from "./components/not-found.tsx";
import { Button } from "./components/ui/button.tsx";
import * as AlertToast from "./components/ui/toast-alert.tsx";
import { ORPCContext } from "./hooks/use-orpc";
import { routeTree } from "./routeTree.gen";
import { orpc } from "./utils/orpc";

export const createRouter = () => {
	const queryClient = new QueryClient({
		queryCache: new QueryCache({
			onError: (error) => {
				toast.custom((t) => (
					<AlertToast.Root
						t={t}
						$status="error"
						$variant="lighter"
						message={`Error: ${error.message}`}
						dismissable={false}
						action={
							<Button
								$size="xxs"
								$style="ghost"
								$type="error"
								onClick={() => queryClient.invalidateQueries()}
							>
								Retry
							</Button>
						}
					/>
				));
			},
		}),
		mutationCache: new MutationCache({
			onError: (error) => {
				toast.custom((t) => (
					<AlertToast.Root
						t={t}
						$status="error"
						$variant="lighter"
						message={`Error: ${error.message}`}
						dismissable={false}
						action={
							<Button
								$size="xxs"
								$style="ghost"
								$type="error"
								onClick={() => queryClient.invalidateQueries()}
							>
								Retry
							</Button>
						}
					/>
				));
			},
		}),
	});

	// export const createRouter = () => {
	const router = createTanstackRouter({
		// Root of all application routes
		routeTree,

		// Restore scroll position when navigating back/forward
		scrollRestoration: true,

		// Preload routes on hover or when user shows intent to navigate
		defaultPreload: "intent",

		// Don't cache preloaded data (always fetch fresh data)
		defaultPreloadStaleTime: 0,

		// Pass our API client and React Query client to all routes
		context: { orpc, queryClient, session: null },

		// Show loading spinner when route is loading
		defaultPendingComponent: () => <Loader />,

		// Simple 404 page when route isn't found
		defaultNotFoundComponent: () => (
			<React.Suspense fallback={<Loader />}>
				<NotFound />
			</React.Suspense>
		),
		// Enable view transition API for smooth page transitions
		defaultViewTransition: true,

		// Wrap all routes with necessary providers
		Wrap: ({ children }) => (
			<QueryClientProvider client={queryClient}>
				{/* Make ORPC client available throughout the app */}
				<ORPCContext.Provider value={orpc}>{children}</ORPCContext.Provider>
			</QueryClientProvider>
		),
	});
	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
