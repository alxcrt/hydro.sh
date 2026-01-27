import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_home")({
	async beforeLoad({ context }) {
		// Redirect logged-in users to dashboard
		if (context.session?.id) {
			throw redirect({
				to: "/dashboard",
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen bg-(--bg-white-0)">
			<Outlet />
		</div>
	);
}
