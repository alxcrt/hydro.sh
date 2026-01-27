import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import type React from "react";
import { useState } from "react";

interface WaterIntakeFormProps {
	onAddWater: (amount: number) => void;
}

export function WaterIntakeForm({ onAddWater }: WaterIntakeFormProps) {
	const [amount, setAmount] = useState(250);

	const handleIncrement = () => {
		setAmount((prev) => prev + 50);
	};

	const handleDecrement = () => {
		setAmount((prev) => Math.max(50, prev - 50));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (amount > 0) {
			onAddWater(amount);
			setAmount(250);
		}
	};

	const presets = [150, 250, 500, 750];

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				handleSubmit(e);
			}}
			className="space-y-5"
		>
			<div>
				<h3 className="font-semibold text-(--text-strong-950) text-label-md">
					Manual Entry
				</h3>
				<p className="mt-1 text-(--text-sub-600) text-paragraph-xs">
					Log water intake not tracked by your bottles
				</p>
			</div>

			{/* Amount selector */}
			<div className="flex items-center justify-center gap-4">
				<button
					type="button"
					onClick={handleDecrement}
					className={cn(
						"flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--stroke-soft-200) bg-(--bg-white-0)",
						"transition-all duration-150",
						"hover:border-(--stroke-sub-300) hover:bg-(--bg-weak-50)",
						"active:scale-95",
					)}
				>
					<Icons.minus className="h-5 w-5 text-(--text-sub-600)" />
				</button>

				<div className="relative flex min-w-[140px] flex-col items-center">
					<input
						type="number"
						min="50"
						step="50"
						value={amount}
						onChange={(e) => setAmount(Number.parseInt(e.target.value) || 0)}
						className="w-full bg-transparent text-center font-semibold text-(--text-strong-950) focus:outline-none"
						style={{ fontSize: "2.5rem", lineHeight: 1 }}
					/>
					<span className="text-(--text-soft-400) text-paragraph-sm">
						milliliters
					</span>
				</div>

				<button
					type="button"
					onClick={handleIncrement}
					className={cn(
						"flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--stroke-soft-200) bg-(--bg-white-0)",
						"transition-all duration-150",
						"hover:border-(--stroke-sub-300) hover:bg-(--bg-weak-50)",
						"active:scale-95",
					)}
				>
					<Icons.plus className="h-5 w-5 text-(--text-sub-600)" />
				</button>
			</div>

			{/* Preset amounts */}
			<div className="flex justify-center gap-2">
				{presets.map((preset) => (
					<button
						key={preset}
						type="button"
						onClick={() => setAmount(preset)}
						className={cn(
							"rounded-full px-3 py-1.5 text-paragraph-xs transition-all duration-150",
							amount === preset
								? "bg-(--color-blue-500) font-medium text-white"
								: "bg-(--bg-weak-50) text-(--text-sub-600) hover:bg-(--bg-soft-200)",
						)}
					>
						{preset}ml
					</button>
				))}
			</div>

			<Button type="submit" $type="primary" $style="filled" className="w-full">
				<Icons.plus className="h-4 w-4" />
				Add Water
			</Button>
		</form>
	);
}
