import { Icons } from "@/components/icons";
import { useORPC } from "@/hooks/use-orpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { endOfDay, format, startOfDay } from "date-fns";
import { useCallback, useMemo, useState } from "react";

import Bottle from "@/components/bottle";
import { Button } from "@/components/ui/button";
import { WaterIntakeForm } from "@/components/water-intake-form";
import { cn } from "@/utils/cn";

export const Route = createFileRoute("/_app/dashboard")({
	loader: async ({ context: { orpc, queryClient } }) => {
		await queryClient.prefetchQuery(orpc.privateData.queryOptions());
		return;
	},
	component: RouteComponent,
});

function HydrationRing({
	current,
	goal,
}: {
	current: number;
	goal: number;
}) {
	const percentage = Math.min(100, Math.round((current / goal) * 100));
	const circumference = 2 * Math.PI * 88;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

	return (
		<div className="relative flex items-center justify-center">
			<svg
				aria-hidden="true"
				className="-rotate-90 h-48 w-48 transform"
				viewBox="0 0 200 200"
			>
				{/* Background ring */}
				<circle
					cx="100"
					cy="100"
					r="88"
					fill="none"
					stroke="var(--stroke-soft-200)"
					strokeWidth="10"
				/>
				{/* Progress ring with gradient */}
				<defs>
					<linearGradient
						id="progressGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop offset="0%" stopColor="var(--color-blue-400)" />
						<stop offset="100%" stopColor="var(--color-blue-600)" />
					</linearGradient>
				</defs>
				<circle
					cx="100"
					cy="100"
					r="88"
					fill="none"
					stroke="url(#progressGradient)"
					strokeWidth="10"
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					className="transition-all duration-700 ease-out"
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span
					className="font-semibold text-(--text-strong-950)"
					style={{ fontSize: "2rem" }}
				>
					{current}
				</span>
				<span className="text-(--text-sub-600) text-paragraph-sm">
					of {goal} ml
				</span>
				<div className="mt-2 flex items-center gap-1.5 rounded-full bg-(--color-blue-50) px-2.5 py-1">
					<span
						className={cn(
							"font-medium text-paragraph-xs",
							percentage >= 100
								? "text-(--color-green-600)"
								: "text-(--color-blue-600)",
						)}
					>
						{percentage}%
					</span>
				</div>
			</div>
		</div>
	);
}

function QuickAddButton({
	amount,
	onClick,
	isLoading,
}: {
	amount: number;
	onClick: (amount: number) => void;
	isLoading?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={() => onClick(amount)}
			disabled={isLoading}
			className={cn(
				"flex flex-col items-center justify-center gap-1 rounded-12 border border-(--stroke-soft-200) bg-(--bg-white-0) px-3 py-2.5",
				"transition-all duration-200 ease-out",
				"hover:border-(--color-blue-300) hover:bg-(--color-blue-50) hover:shadow-sm",
				"active:scale-95",
				"disabled:cursor-not-allowed disabled:opacity-50",
			)}
		>
			<Icons.waterDroplet className="h-4 w-4 text-(--color-blue-500)" />
			<span className="font-medium text-(--text-strong-950) text-label-xs">
				{amount}ml
			</span>
		</button>
	);
}

function IntakeLogItem({
	amount,
	timestamp,
	source,
	brand,
}: {
	amount: string;
	timestamp: Date;
	source: string;
	brand?: string;
}) {
	const date = new Date(timestamp);
	const formattedTime = format(date, "h:mm a");

	return (
		<div className="flex items-center justify-between py-3">
			<div className="flex items-center gap-3">
				<div
					className={cn(
						"flex h-9 w-9 items-center justify-center rounded-10",
						source === "bottle"
							? "bg-(--color-blue-50)"
							: "bg-(--color-green-50)",
					)}
				>
					{source === "bottle" ? (
						<Icons.bluetooth className="h-4 w-4 text-(--color-blue-500)" />
					) : (
						<Icons.waterDroplet className="h-4 w-4 text-(--color-green-500)" />
					)}
				</div>
				<div>
					<span className="font-medium text-(--text-strong-950) text-label-sm">
						{amount}ml
					</span>
					{brand && (
						<span className="ml-2 text-(--text-soft-400) text-paragraph-xs">
							{brand}
						</span>
					)}
				</div>
			</div>
			<span className="font-mono text-(--text-sub-600) text-paragraph-xs">
				{formattedTime}
			</span>
		</div>
	);
}

function RouteComponent() {
	const orpc = useORPC();
	const queryClient = useQueryClient();
	const [bottleCount, setBottleCount] = useState(1);

	const todayStart = useMemo(() => startOfDay(new Date()), []);
	const todayEnd = useMemo(() => endOfDay(new Date()), []);

	const waterIntakeListInput = useMemo(
		() => ({
			limit: 5,
			offset: 0,
			startDate: todayStart,
			endDate: todayEnd,
		}),
		[todayStart, todayEnd],
	);

	const waterIntakes = useQuery({
		...orpc.waterIntake.list.queryOptions({
			input: waterIntakeListInput,
		}),
		refetchInterval: 30 * 1000,
	});

	const { mutateAsync: createWaterIntake, isPending } = useMutation(
		orpc.waterIntake.create.mutationOptions(),
	);

	const totalIntake = useMemo(() => {
		return (
			Math.round(
				(waterIntakes.data?.reduce(
					(acc, curr) => acc + Number(curr.amount),
					0,
				) ?? 0) * 10,
			) / 10
		);
	}, [waterIntakes.data]);

	const goalAmount = 2500;

	const onManualWaterIntake = useCallback(
		async (amount: number) => {
			await createWaterIntake({
				amount: amount,
				timestamp: new Date(),
				bottleBrand: "Manual",
				source: "manual",
			});

			await queryClient.invalidateQueries({
				queryKey: orpc.waterIntake.list.queryOptions({
					input: waterIntakeListInput,
				}).queryKey,
			});
		},
		[
			createWaterIntake,
			queryClient,
			orpc.waterIntake.list,
			waterIntakeListInput,
		],
	);

	const quickAddAmounts = [100, 250, 350, 500];

	const addBottle = useCallback(() => {
		setBottleCount((prev) => prev + 1);
	}, []);

	const removeBottle = useCallback(() => {
		setBottleCount((prev) => Math.max(1, prev - 1));
	}, []);

	return (
		<div className="flex flex-1 flex-col">
			{/* Header */}
			<header className="border-(--stroke-soft-200) border-b px-6 py-5 lg:px-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-12 bg-(--color-blue-50)">
							<Icons.waterDroplet className="h-5 w-5 text-(--color-blue-500)" />
						</div>
						<div>
							<h1 className="font-semibold text-(--text-strong-950) text-label-lg">
								{new Date().toLocaleDateString("en-US", {
									weekday: "long",
									month: "long",
									day: "numeric",
								})}
							</h1>
							<p className="text-(--text-sub-600) text-paragraph-sm">
								Track your daily hydration
							</p>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 p-6 lg:p-8">
				<div className="grid gap-6 lg:grid-cols-2">
					{/* Left Column - Progress & Bottles */}
					<div className="space-y-6">
						{/* Hydration Progress Card */}
						<div className="rounded-16 border border-(--stroke-soft-200) bg-(--bg-white-0) p-6">
							<h2 className="mb-6 font-semibold text-(--text-strong-950) text-label-md">
								Today's Progress
							</h2>
							<div className="flex justify-center">
								<HydrationRing current={totalIntake} goal={goalAmount} />
							</div>

							{/* Quick Add Buttons */}
							<div className="mt-6">
								<p className="mb-3 text-center text-(--text-sub-600) text-paragraph-xs">
									Quick add
								</p>
								<div className="grid grid-cols-4 gap-2">
									{quickAddAmounts.map((amount) => (
										<QuickAddButton
											key={amount}
											amount={amount}
											onClick={onManualWaterIntake}
											isLoading={isPending}
										/>
									))}
								</div>
							</div>
						</div>

						{/* Connected Bottles */}
						<div className="rounded-16 border border-(--stroke-soft-200) bg-(--bg-white-0) p-6">
							<div className="mb-4 flex items-center justify-between">
								<h2 className="font-semibold text-(--text-strong-950) text-label-md">
									Smart Bottles
								</h2>
								<div className="flex items-center gap-2">
									{bottleCount > 1 && (
										<Button
											$size="xs"
											$style="stroke"
											onClick={removeBottle}
											className="h-7 w-7 p-0"
										>
											<Icons.minus className="h-3.5 w-3.5" />
										</Button>
									)}
									<Button
										$size="xs"
										$style="stroke"
										onClick={addBottle}
										className="h-7 w-7 p-0"
									>
										<Icons.plus className="h-3.5 w-3.5" />
									</Button>
								</div>
							</div>
							<p className="mb-4 text-(--text-sub-600) text-paragraph-xs">
								Connect your smart water bottles to automatically track intake
							</p>
							<div className="space-y-3">
								{Array.from({ length: bottleCount }).map((_, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: Static list of identical components with no reordering
									<Bottle key={index} />
								))}
							</div>
						</div>
					</div>

					{/* Right Column - Log & Manual Entry */}
					<div className="space-y-6">
						{/* Manual Entry Card */}
						<div className="rounded-16 border border-(--stroke-soft-200) bg-(--bg-white-0) p-6">
							<WaterIntakeForm onAddWater={onManualWaterIntake} />
						</div>

						{/* Today's Log */}
						<div className="rounded-16 border border-(--stroke-soft-200) bg-(--bg-white-0) p-6">
							<h2 className="mb-1 font-semibold text-(--text-strong-950) text-label-md">
								Today's Log
							</h2>
							<p className="mb-4 text-(--text-sub-600) text-paragraph-xs">
								Recent water intake entries
							</p>

							<div className="divide-y divide-(--stroke-soft-200)">
								{waterIntakes.data && waterIntakes.data.length > 0 ? (
									waterIntakes.data.map((intake) => (
										<IntakeLogItem
											key={intake.id}
											amount={intake.amount}
											timestamp={intake.timestamp}
											source={intake.source}
											brand={intake.bottleBrand ?? undefined}
										/>
									))
								) : (
									<div className="py-10 text-center">
										<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-(--bg-weak-50)">
											<Icons.waterDroplet className="h-6 w-6 text-(--text-soft-400)" />
										</div>
										<p className="font-medium text-(--text-sub-600) text-paragraph-sm">
											No entries yet
										</p>
										<p className="mt-1 text-(--text-soft-400) text-paragraph-xs">
											Start tracking to see your history
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
