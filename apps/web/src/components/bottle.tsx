import { useBottle } from "@/hooks/useBottle";
import { cn } from "@/utils/cn";
import { orpc } from "@/utils/orpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import * as Modal from "./ui/modal";

export default function Bottle() {
	const queryClient = useQueryClient();

	const { mutateAsync: createWaterIntake } = useMutation(
		orpc.waterIntake.create.mutationOptions(),
	);

	const onHandleSipData = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		async (sipData: any) => {
			await createWaterIntake({
				amount: sipData.sipSize,
				timestamp: sipData.timestamp,
				bottleBrand: "Hydro Bottle 1",
				source: "bottle",
			});

			await queryClient.invalidateQueries({
				queryKey: orpc.waterIntake.list.queryOptions().queryKey,
			});
		},
		[createWaterIntake, queryClient],
	);

	const [isDrinking, setIsDrinking] = useState(false);
	const [ledColor1, setLedColor1] = useState("#3b82f6");
	const [ledColor2, setLedColor2] = useState("#06b6d4");
	const [showConnectHint, setShowConnectHint] = useState(false);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const onHandleDebug = useCallback((data: any) => {
		if (data.data[0] === 129) {
			setIsDrinking(true);
		} else {
			setIsDrinking(false);
		}
	}, []);

	const {
		isConnected,
		isConnecting,
		batteryLevel,
		device,
		connect,
		disconnect,
		setLedColor,
	} = useBottle({ onHandleSipData, onHandleDebug });

	const handleConnect = useCallback(() => {
		setShowConnectHint(true);
	}, []);

	const handleConfirmConnect = useCallback(() => {
		setShowConnectHint(false);
		connect();
	}, [connect]);

	return (
		<div
			className={cn(
				"group relative overflow-hidden rounded-16 border bg-(--bg-white-0) transition-all duration-300",
				isConnected
					? "border-(--color-blue-200)"
					: "border-(--stroke-soft-200)",
				isDrinking && "border-(--color-blue-400) shadow-blue-200/50 shadow-lg",
			)}
		>
			{/* Tilt/Drinking Indicator - Full width banner at top */}
			<div
				className={cn(
					"flex items-center justify-center gap-3 overflow-hidden bg-[length:200%_100%] bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 transition-all duration-300",
					isDrinking
						? "h-14 animate-[shimmer_2s_linear_infinite] opacity-100"
						: "h-0 opacity-0",
				)}
				style={{
					// @ts-ignore
					"--tw-animate-shimmer": "shimmer 2s linear infinite",
				}}
			>
				<div className="flex items-center gap-3">
					{/* Animated water drops */}
					<div className="flex gap-1">
						<span className="h-2 w-2 animate-bounce rounded-full bg-white/80 [animation-delay:0ms]" />
						<span className="h-2 w-2 animate-bounce rounded-full bg-white/80 [animation-delay:150ms]" />
						<span className="h-2 w-2 animate-bounce rounded-full bg-white/80 [animation-delay:300ms]" />
					</div>

					<span className="font-semibold text-label-md text-white tracking-wide">
						Bottle Tilted — Recording Intake
					</span>

					{/* Pulsing indicator */}
					<span className="relative flex h-3 w-3">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
						<span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
					</span>
				</div>
			</div>

			{/* Main content */}
			<div className="p-4">
				<div className="relative flex items-center gap-4">
					{/* Bottle icon with status */}
					<div className="relative">
						<div
							className={cn(
								"flex h-12 w-12 items-center justify-center rounded-12 transition-all duration-300",
								isConnected
									? isDrinking
										? "bg-gradient-to-br from-blue-400 to-cyan-400"
										: "bg-(--color-blue-100)"
									: "bg-(--bg-weak-50)",
							)}
						>
							{isDrinking ? (
								<svg
									aria-hidden="true"
									className="h-6 w-6 text-white"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M12 2v6" />
									<path d="M12 22a8 8 0 0 0 8-8c0-3.5-2-7-8-10-6 3-8 6.5-8 10a8 8 0 0 0 8 8" />
								</svg>
							) : (
								<Icons.bluetooth
									className={cn(
										"h-6 w-6 transition-all duration-300",
										isConnected
											? "text-(--color-blue-500)"
											: "text-(--text-soft-400)",
									)}
								/>
							)}
						</div>

						{/* Connection status dot */}
						<div
							className={cn(
								"-right-0.5 -bottom-0.5 absolute h-3.5 w-3.5 rounded-full border-2 border-white transition-colors duration-300",
								isDrinking
									? "animate-pulse bg-(--color-blue-500)"
									: isConnected
										? "bg-(--color-green-500)"
										: "bg-(--text-soft-400)",
							)}
						/>
					</div>

					{/* Device info */}
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<span className="truncate font-semibold text-(--text-strong-950) text-label-sm">
								{device?.name || "No device connected"}
							</span>
						</div>

						<div className="mt-1 flex items-center gap-2 text-(--text-sub-600) text-paragraph-xs">
							{isConnected ? (
								<>
									{isDrinking ? (
										<span className="inline-flex items-center gap-1.5 font-medium text-(--color-blue-600)">
											<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--color-blue-500)" />
											Active
										</span>
									) : (
										<span className="inline-flex items-center gap-1">
											<span className="h-1.5 w-1.5 rounded-full bg-(--color-green-500)" />
											Connected
										</span>
									)}
									{batteryLevel !== null && batteryLevel !== undefined && (
										<>
											<span className="text-(--text-soft-400)">·</span>
											<span className="inline-flex items-center gap-1">
												<svg
													aria-hidden="true"
													className="h-3.5 w-3.5"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<rect x="2" y="7" width="18" height="10" rx="2" />
													<path d="M22 11v2" />
													<rect
														x="4"
														y="9"
														width={Math.max(1, (batteryLevel / 100) * 14)}
														height="6"
														fill="currentColor"
														className={cn(
															batteryLevel > 20
																? "text-(--color-green-500)"
																: "text-(--color-red-500)",
														)}
													/>
												</svg>
												{batteryLevel}%
											</span>
										</>
									)}
								</>
							) : (
								<span className="text-(--text-soft-400)">
									Tap connect to pair your bottle
								</span>
							)}
						</div>
					</div>

					{/* Connect button */}
					<Button
						type="button"
						$style={isConnected ? "stroke" : "filled"}
						$type={isConnected ? "neutral" : "primary"}
						$size="sm"
						onClick={isConnected ? disconnect : handleConnect}
						disabled={isConnecting}
						className="shrink-0"
					>
						{isConnecting ? (
							<>
								<svg
									aria-hidden="true"
									className="h-4 w-4 animate-spin"
									viewBox="0 0 24 24"
									fill="none"
								>
									<circle
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="3"
										strokeLinecap="round"
										className="opacity-25"
									/>
									<path
										d="M12 2a10 10 0 0 1 10 10"
										stroke="currentColor"
										strokeWidth="3"
										strokeLinecap="round"
									/>
								</svg>
								Connecting
							</>
						) : isConnected ? (
							"Disconnect"
						) : (
							"Connect"
						)}
					</Button>
				</div>

				{/* LED Color Controls - Only show when connected */}
				{isConnected && (
					<div className="relative mt-4 flex items-center gap-3 border-(--stroke-soft-200) border-t pt-4">
						<span className="text-(--text-sub-600) text-paragraph-xs">
							LED Colors
						</span>
						<div className="flex items-center gap-2">
							<label className="group/color relative cursor-pointer">
								<input
									type="color"
									className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
									value={ledColor1}
									onChange={(e) => setLedColor1(e.target.value)}
								/>
								<div
									className="h-7 w-7 rounded-8 shadow-sm ring-2 ring-white transition-transform group-hover/color:scale-110"
									style={{ backgroundColor: ledColor1 }}
								/>
							</label>
							<label className="group/color relative cursor-pointer">
								<input
									type="color"
									className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
									value={ledColor2}
									onChange={(e) => setLedColor2(e.target.value)}
								/>
								<div
									className="h-7 w-7 rounded-8 shadow-sm ring-2 ring-white transition-transform group-hover/color:scale-110"
									style={{ backgroundColor: ledColor2 }}
								/>
							</label>
						</div>
						<Button
							$size="xs"
							$style="stroke"
							onClick={() => setLedColor(ledColor1, ledColor2)}
							className="ml-auto"
						>
							Apply Colors
						</Button>
					</div>
				)}
			</div>

			{/* Connection Help Modal */}
			<Modal.Root open={showConnectHint} onOpenChange={setShowConnectHint}>
				<Modal.Content className="max-w-[400px]">
					<Modal.Header
						title="Connect Your Bottle"
						description="Follow these steps to pair your smart water bottle"
					/>
					<Modal.Body className="space-y-4">
						<div className="flex items-start gap-4 rounded-12 border border-(--stroke-soft-200) bg-(--bg-weak-50) p-4">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--color-blue-500) font-semibold text-label-sm text-white">
								1
							</div>
							<div>
								<p className="font-medium text-(--text-strong-950) text-label-sm">
									Wake up your bottle
								</p>
								<p className="mt-0.5 text-(--text-sub-600) text-paragraph-xs">
									Give it a gentle shake to activate the Bluetooth sensor
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4 rounded-12 border border-(--stroke-soft-200) bg-(--bg-weak-50) p-4">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--color-blue-500) font-semibold text-label-sm text-white">
								2
							</div>
							<div>
								<p className="font-medium text-(--text-strong-950) text-label-sm">
									Select from device list
								</p>
								<p className="mt-0.5 text-(--text-sub-600) text-paragraph-xs">
									Look for a device starting with{" "}
									<code className="rounded bg-(--bg-soft-200) px-1 py-0.5 font-mono text-paragraph-xs">
										h2o
									</code>{" "}
									(e.g., h2oC915E)
								</p>
							</div>
						</div>

						<p className="text-center text-(--text-soft-400) text-paragraph-xs">
							Don't see your bottle? Try shaking it again.
						</p>
					</Modal.Body>
					<Modal.Footer className="justify-end gap-2">
						<Button $style="stroke" onClick={() => setShowConnectHint(false)}>
							Cancel
						</Button>
						<Button $type="primary" onClick={handleConfirmConnect}>
							Continue to Pair
						</Button>
					</Modal.Footer>
				</Modal.Content>
			</Modal.Root>
		</div>
	);
}
