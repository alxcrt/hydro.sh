import { Toaster } from "@/components/ui/toast";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import type { QueryClient } from "@tanstack/react-query";
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { LazyMotion, domAnimation } from "motion/react";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

import { authClient } from "@/lib/auth-client";
import type { orpc } from "@/utils/orpc";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import type { Session } from "better-auth";
import type { User } from "better-auth";
import appCss from "../app.css?url";
import tailwindCss from "../tailwind.css?url";

/**
 * This interface defines the application context available to all routes:
 *
 * - orpc: The ORPCClient instance for making API calls to the server
 *   This client provides type-safe communication with the server API endpoints
 *   using ORPC (Object Remote Procedure Call)
 *
 * - queryClient: The React Query client for managing server state and caching
 *   This provides data fetching, caching, and state management capabilities
 *   throughout the application
 *
 * - session: The user's authentication session, or null if not logged in
 *   - Combines the Session type with User information when authenticated
 *   - When no user is logged in, this will be null
 *   - Contains user information like id, name, email, and profile image
 */
export interface RouterAppContext {
	orpc: typeof orpc;
	queryClient: QueryClient;
	session: (Session & { user: User }) | null;
}

/**
 * Server function that retrieves the current authentication state
 *
 * This function:
 * 1. Runs on the server during SSR (Server-Side Rendering)
 * 2. Extracts cookies from the incoming request headers
 * 3. Uses authClient to verify the session with those cookies
 * 4. Returns the session data if authenticated, or null if not
 *
 * The returned data is used to hydrate the initial app state,
 * avoiding the need for an additional auth check when the app loads
 */
export const authStateFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const request = getWebRequest();
		if (!request)
			throw new Error("No request found in current execution context");
		const { data } = await authClient.getSession({
			fetchOptions: {
				headers: {
					cookie: request.headers.get("cookie") || "",
				},
			},
		});

		return data;
	},
);

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Hydro.sh",
			},
			{
				name: "description",
				content:
					"Track your hydration effortlessly. Connect your smart water bottle and automatically track every sip.",
			},
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:title",
				content: "Hydro.sh",
			},
			{
				property: "og:description",
				content:
					"Track your hydration effortlessly. Connect your smart water bottle and automatically track every sip.",
			},
			{
				property: "og:image",
				content: `${import.meta.env.VITE_SERVER_URL}/api/og`,
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "Hydro.sh",
			},
			{
				name: "twitter:description",
				content:
					"Track your hydration effortlessly. Connect your smart water bottle and automatically track every sip.",
			},
			{
				name: "twitter:image",
				content: `${import.meta.env.VITE_SERVER_URL}/api/og`,
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
				sizes: "32x32",
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon-32x32.png",
				sizes: "32x32",
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon-16x16.png",
				sizes: "16x16",
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "stylesheet",
				href: tailwindCss,
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	async beforeLoad() {
		// This function runs before the route loads
		// 1. It calls authStateFn() which extracts cookies from the request
		//    and verifies the session server-side
		const session = await authStateFn();

		// 2. Return the session data to be added to the router context
		// 3. If a session exists, we structure it to include both session data
		//    and user data from the auth response
		// 4. If no session exists (user not logged in), we return null
		// 5. This makes the session available to all routes via context.session
		return {
			session: session
				? {
						...session.session,
						user: session.user,
					}
				: null,
		};
	},
	component: RootComponent,
});

function RootComponent() {
	return (
		<ThemeProvider
			disableTransitionOnChange
			attribute={["class", "data-theme"]}
			defaultTheme="light"
		>
			<RootDocument>
				<NuqsAdapter>
					<LazyMotion features={domAnimation}>
						<Outlet />
					</LazyMotion>
				</NuqsAdapter>
			</RootDocument>
		</ThemeProvider>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	// This line uses the useRouterState hook from TanStack Router to check if a route transition is in progress.
	// It selects the 'isLoading' state from the router's state using the 'select' property.
	// When isLoading is true, it means the router is currently fetching data for a new route.
	// This state is used below to show a Loader component during route transitions.
	// const isFetching = useRouterState({ select: (s) => s.isLoading });

	return (
		<html lang="en" className="h-full antialiased" suppressHydrationWarning>
			<head>
				<HeadContent />

				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap"
					rel="stylesheet"
				/>
				<script
					defer
					data-domain="hydro.alexcretu.com"
					src="https://plausible.alexcretu.com/js/script.js"
				/>
			</head>
			<body
				className="h-full bg-(--bg-white-0) text-(--text-strong-950)"
				suppressHydrationWarning
			>
				{/*
          We've removed the loader during route transitions since the app now works
          perfectly with preloaded data and view transitions. The loader was causing
          an ugly flash during navigation.
        */}
				{children}

				<Toaster position="top-center" />
				<TanStackRouterDevtools position="bottom-right" />
				<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
				<Scripts />
			</body>
		</html>
	);
}
