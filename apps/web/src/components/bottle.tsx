import { useBottle } from "@/hooks/useBottle";
import { orpc } from "@/utils/orpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";

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

			console.log("Water intake created");

			// refetch waterIntakes
			await queryClient.invalidateQueries({
				queryKey: orpc.waterIntake.list.queryOptions().queryKey,
			});
		},
		[createWaterIntake, queryClient],
	);

	const [isDrinking, setIsDrinking] = useState(false);
	const [ledColor1, setLedColor1] = useState("#000000");
	const [ledColor2, setLedColor2] = useState("#000000");

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

	return (
		<div className="flex items-center gap-3 rounded-8 bg-state-faded-lighter px-3 py-2">
			<span title="Bluetooth" className="text-blue-500">
				<svg
					width={20}
					height={20}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M7 7l10 10-5 5V2l5 5L7 17" />
				</svg>
			</span>
			<span className="font-medium">{device?.name || "No device"}</span>
			<span className="text-gray-500 text-xs">
				{batteryLevel !== null && batteryLevel !== undefined
					? `${batteryLevel}%`
					: "Battery: ?"}
			</span>
			<Button
				type="button"
				$style="stroke"
				$size="sm"
				className="rounded-8 border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100"
				onClick={isConnected ? disconnect : connect}
				disabled={isConnecting}
			>
				{isConnecting
					? "Connecting..."
					: isConnected
						? "Disconnect"
						: "Connect"}
			</Button>
			{/* <ColorPickerDemo /> */}
			<div className="flex items-center gap-2">
				<input
					type="color"
					className="h-6 w-6"
					value={ledColor1}
					onChange={(e) => setLedColor1(e.target.value)}
				/>
				<input
					type="color"
					className="h-6 w-6"
					value={ledColor2}
					onChange={(e) => setLedColor2(e.target.value)}
				/>
				<Button
					$size="xs"
					$style="stroke"
					onClick={() => setLedColor(ledColor1, ledColor2)}
				>
					Apply
				</Button>
			</div>
			<span className={isDrinking ? "animate-spin text-blue-500" : ""}>
				<Icons.bottle />
			</span>
			<div className="ml-1 flex items-center">
				{isDrinking && (
					<span className="inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5 font-medium text-blue-800 text-xs">
						Drinking
						<span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
					</span>
				)}
			</div>
		</div>
	);
}
