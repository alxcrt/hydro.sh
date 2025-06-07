import { DashedDivider } from "@/components/dashed-divider";
import { Icons } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

import { useORPC } from "@/hooks/use-orpc";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import Bottle from "@/components/bottle";
import { WaterIntakeHistoryTable } from "@/components/tables/water-intake-history";
import { WaterIntakeForm } from "@/components/water-intake-form";
import { WaterTotalHydration } from "@/components/water-total-hydration";
import { useCallback } from "react";

export const Route = createFileRoute("/_app/dashboard")({
	loader: async ({ context: { orpc, queryClient } }) => {
		await queryClient.prefetchQuery(orpc.privateData.queryOptions());
		return;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const orpc = useORPC();
	const queryClient = useQueryClient();

	const waterIntakeListInput = {
		limit: 5,
		offset: 0,
	};

	const waterIntakes = useQuery({
		...orpc.waterIntake.list.queryOptions({
			input: waterIntakeListInput,
		}),
		refetchInterval: 30 * 1000, // Invalidate and refetch every 30 seconds
	});

	const { mutateAsync: createWaterIntake } = useMutation(
		orpc.waterIntake.create.mutationOptions(),
	);

	const onManualWaterIntake = useCallback(
		async (amount: number) => {
			await createWaterIntake({
				amount: amount,
				timestamp: new Date(),
				bottleBrand: "Manual",
				source: "manual",
			});

			console.log("Water intake created");

			// refetch waterIntakes
			await queryClient.invalidateQueries({
				queryKey: orpc.waterIntake.list.queryOptions({
					input: waterIntakeListInput,
				}).queryKey,
			});
		},
		[createWaterIntake, queryClient, orpc.waterIntake.list],
	);

	return (
		<>
			<PageHeader
				icon={
					<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-(--stroke-soft-200) ring-1 ring-inset">
						<Icons.soda className="size-6 text-(--text-sub-600)" />
					</div>
				}
				title={new Date().toLocaleDateString("en-US", {
					weekday: "long",
					month: "long",
					day: "numeric",
				})}
				description="Track your water intake and monitor your hydration status"
			>
				<div className="flex gap-2">
					<Button $type="neutral" $style="stroke">
						<Icons.sync className="size-4" />
						Sync Generic
					</Button>
					<Button $type="primary" $style="filled">
						<Icons.syncAll className="size-4" color="white" />
						Sync All
					</Button>
				</div>
			</PageHeader>

			<DashedDivider />

			<div className="grid gap-4 px-4 pb-6 lg:px-8 ">
				<DashedDivider />
				<div className="grid grid-cols-2 gap-4">
					<WaterTotalHydration
						currentAmount={
							waterIntakes.data?.reduce(
								(acc, curr) => acc + Number(curr.amount),
								0,
							) ?? 0
						}
						goalAmount={2500}
					/>
					<div className="flex flex-col gap-4">
						<WaterIntakeForm onAddWater={onManualWaterIntake} />
						<Bottle />
						<Bottle />
					</div>
				</div>
				<WaterIntakeHistoryTable data={waterIntakes.data ?? []} total={1000} />
			</div>
		</>
	);
}
