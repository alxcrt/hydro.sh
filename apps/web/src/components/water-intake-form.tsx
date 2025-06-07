import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
			setAmount(250); // Reset to default
		}
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				handleSubmit(e);
			}}
			className="w-full space-y-4 rounded-8 bg-state-faded-lighter px-2.5 py-2 text-(--text-strong-950) text-paragraph-sm"
		>
			<div className="space-y-2">
				<h3 className="font-semibold text-paragraph-lg">🥤 Manual Entry</h3>
				<label
					htmlFor="water-amount"
					className="font-medium text-(--text-sub-600) text-paragraph-sm "
				>
					Add water intake not tracked by your bottle. (ml)
				</label>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						$type="neutral"
						$style="stroke"
						onClick={handleDecrement}
					>
						<Icons.minus className="h-4 w-4" />
					</Button>
					<Input
						id="water-amount"
						type="number"
						min="50"
						step="50"
						value={amount}
						onChange={(e) => setAmount(Number.parseInt(e.target.value) || 0)}
						className="text-center"
					/>
					<Button
						type="button"
						$type="neutral"
						$style="stroke"
						onClick={handleIncrement}
					>
						<Icons.plus className="h-4 w-4" />
					</Button>
				</div>
			</div>
			<Button type="submit" $type="primary" $style="filled" className="w-full">
				Add Water
			</Button>
		</form>
	);
}
