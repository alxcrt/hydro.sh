import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/devices")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<h1>Devices</h1>
		</div>
	);
}
