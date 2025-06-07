"use client";

import AddCircleIcon from "virtual:icons/hugeicons/add-circle";
import SodaIcon from "virtual:icons/hugeicons/soda-can-stroke-rounded";
import { createFileRoute } from "@tanstack/react-router";

import { DashedDivider } from "@/components/dashed-divider";
import { PageHeader } from "@/components/page-header";
import { DevicesTable } from "@/components/tables/devices-table";
import { Button } from "@/components/ui/button";
import { useActionsParams } from "@/hooks/use-actions-params";
import { useORPC } from "@/hooks/use-orpc";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/devices")({
	component: RouteComponent,
});

function RouteComponent() {
	const orpc = useORPC();
	const { setParams } = useActionsParams();

	const { data: devices } = useQuery(orpc.devices.list.queryOptions());

	return (
		<>
			<PageHeader
				icon={
					<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-(--stroke-soft-200) ring-1 ring-inset">
						<SodaIcon className="size-6 text-(--text-sub-600)" />
					</div>
				}
				title="Devices"
				description="See all the devices you've connected"
			>
				<Button
					$type="neutral"
					onClick={() => setParams({ action: "add", resource: "device" })}
					trailingIcon={AddCircleIcon}
				>
					Add Device
				</Button>
			</PageHeader>

			<div className="grid gap-4 px-4 pb-6 lg:px-8">
				<DashedDivider />

				<DevicesTable data={devices ?? []} total={devices?.length ?? 0} />
			</div>
		</>
	);
}
