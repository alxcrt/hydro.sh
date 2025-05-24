import { Toaster } from "@/components/ui/toast";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import type { QueryClient } from "@tanstack/react-query";
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "next-themes";
import Header from "../components/header";

import Loader from "@/components/loader";
import type { orpc } from "@/utils/orpc";
import appCss from "../app.css?url";
import tailwindCss from "../tailwind.css?url";

export interface RouterAppContext {
	orpc: typeof orpc;
	queryClient: QueryClient;
}

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
		],
		links: [
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
				<Outlet />
			</RootDocument>
		</ThemeProvider>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	const isFetching = useRouterState({ select: (s) => s.isLoading });

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
			</head>
			<body
				className="h-full bg-(--bg-white-0) text-(--text-strong-950)"
				suppressHydrationWarning
			>
				<Header />
				{isFetching ? <Loader /> : children}
				<Toaster position="top-center" />
				<TanStackRouterDevtools position="bottom-right" />
				<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
				<Scripts />
			</body>
		</html>
	);
}
