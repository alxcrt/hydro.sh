import { useORPC } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const orpc = useORPC();
	const healthCheck = useQuery(orpc.healthCheck.queryOptions());

	return (
		<div className="container mx-auto flex-1 px-5">
			<div className="mt-48 flex flex-col items-center">
				<h1 className="max-w-3xl text-balance font-monotext-center text-text-strong-950 text-title-h3">
					Hydro.sh
				</h1>

				<div className="mt-12">
					<h2 className="font-semibold text-lg text-text-primary">
						API Status
					</h2>
					<div className="mt-3 flex items-center gap-2">
						<div
							className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
						/>
						<span className="text-sm text-text-sub-600">
							{healthCheck.isLoading
								? "Checking..."
								: healthCheck.data
									? "Connected"
									: "Disconnected"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
