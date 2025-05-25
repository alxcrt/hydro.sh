import { useMe } from "@/hooks/use-me";
import { useORPC } from "@/hooks/use-orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
	loader: async ({ context: { orpc, queryClient } }) => {
		await queryClient.prefetchQuery(orpc.privateData.queryOptions());
		return;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const orpc = useORPC();
	const me = useMe();

	const privateData = useQuery(orpc.privateData.queryOptions());

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {me?.fullName}</p>
			<p>privateData: {privateData.data?.message}</p>
		</div>
	);
}
