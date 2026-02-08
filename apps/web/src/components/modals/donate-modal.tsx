import FavouriteIcon from "virtual:icons/hugeicons/favourite";
import Loading03Icon from "virtual:icons/hugeicons/loading-03";

import * as React from "react";

import { useORPC } from "@/hooks/use-orpc.ts";
import { cn } from "@/utils/cn.ts";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button.tsx";
import * as Modal from "../ui/modal.tsx";

const presetAmounts = [
	{ value: 300, label: "$3" },
	{ value: 500, label: "$5" },
	{ value: 1000, label: "$10" },
	{ value: 2500, label: "$25" },
];

export function DonateModal({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const orpc = useORPC();
	const [selectedAmount, setSelectedAmount] = React.useState<number | null>(
		500,
	);
	const [customAmount, setCustomAmount] = React.useState("");
	const [message, setMessage] = React.useState("");

	const createCheckout = useMutation(
		orpc.stripe.createCheckoutSession.mutationOptions(),
	);

	const resolvedAmount = React.useMemo(() => {
		if (customAmount) {
			const parsed = Number.parseFloat(customAmount);
			if (!Number.isNaN(parsed) && parsed > 0) {
				return Math.round(parsed * 100);
			}
			return null;
		}
		return selectedAmount;
	}, [customAmount, selectedAmount]);

	const handleSubmit = async () => {
		if (!resolvedAmount || resolvedAmount < 100) return;

		try {
			const result = await createCheckout.mutateAsync({
				amount: resolvedAmount,
				message: message || undefined,
			});

			window.location.href = result.url;
		} catch {
			// Error is handled by the mutation state below
		}
	};

	const handlePresetClick = (value: number) => {
		setSelectedAmount(value);
		setCustomAmount("");
	};

	const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
			setCustomAmount(val);
			setSelectedAmount(null);
		}
	};

	return (
		<Modal.Root open={open} onOpenChange={onOpenChange}>
			<Modal.Content className="max-w-[440px]">
				<Modal.Header
					icon={FavouriteIcon}
					title="Support me"
					description="I build Hydro.sh solo in my free time. Your support helps cover hosting costs and keeps me motivated to ship new features."
				/>

				<Modal.Body className="space-y-5">
					{/* Preset Amounts */}
					<div>
						<p className="mb-2 text-(--text-sub-600) text-paragraph-xs">
							Choose an amount
						</p>
						<div className="grid grid-cols-4 gap-2">
							{presetAmounts.map(({ value, label }) => (
								<button
									key={value}
									type="button"
									onClick={() => handlePresetClick(value)}
									className={cn(
										"flex items-center justify-center rounded-10 border py-2.5 font-medium text-label-sm",
										"transition-all duration-200 ease-out",
										"hover:shadow-sm",
										selectedAmount === value && !customAmount
											? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
											: "border-(--stroke-soft-200) bg-(--bg-white-0) text-(--text-sub-600) hover:border-(--stroke-soft-200) hover:bg-(--bg-weak-50)",
									)}
								>
									{label}
								</button>
							))}
						</div>
					</div>

					{/* Custom Amount */}
					<div>
						<label
							htmlFor="custom-amount"
							className="mb-2 block text-(--text-sub-600) text-paragraph-xs"
						>
							Or enter a custom amount
						</label>
						<div className="relative">
							<span className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 text-(--text-soft-400) text-paragraph-sm">
								$
							</span>
							<input
								id="custom-amount"
								type="text"
								inputMode="decimal"
								placeholder="0.00"
								value={customAmount}
								onChange={handleCustomAmountChange}
								className={cn(
									"w-full rounded-12 bg-(--bg-white-0) py-2.5 pr-3 pl-7 text-(--text-strong-950) text-paragraph-sm shadow-xs",
									"ring-(--stroke-soft-200) ring-1 ring-inset",
									"transition duration-200 ease-out",
									"placeholder:text-(--text-soft-400)",
									"hover:[&:not(:focus)]:bg-(--bg-weak-50) hover:[&:not(:focus)]:ring-transparent",
									"focus:shadow-button-important-focus focus:outline-none focus:ring-(--stroke-strong-950)",
								)}
							/>
						</div>
					</div>

					{/* Minimum amount hint */}
					{customAmount && resolvedAmount !== null && resolvedAmount < 100 && (
						<p className="text-paragraph-xs text-red-500">
							Minimum donation is $1.00
						</p>
					)}

					{/* Message */}
					<div>
						<label
							htmlFor="donate-message"
							className="mb-2 block text-(--text-sub-600) text-paragraph-xs"
						>
							Leave a message{" "}
							<span className="text-(--text-soft-400)">(optional)</span>
						</label>
						<textarea
							id="donate-message"
							placeholder="Keep up the great work!"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							rows={2}
							maxLength={200}
							className={cn(
								"block w-full resize-none rounded-12 bg-(--bg-white-0) px-3 py-2.5 text-(--text-strong-950) text-paragraph-sm shadow-xs",
								"ring-(--stroke-soft-200) ring-1 ring-inset",
								"transition duration-200 ease-out",
								"placeholder:text-(--text-soft-400)",
								"hover:[&:not(:focus)]:bg-(--bg-weak-50) hover:[&:not(:focus)]:ring-transparent",
								"focus:shadow-button-important-focus focus:outline-none focus:ring-(--stroke-strong-950)",
							)}
						/>
					</div>
				</Modal.Body>

				<Modal.Footer className="flex-col gap-3 sm:flex-row">
					{createCheckout.isError && (
						<p className="w-full text-center text-paragraph-xs text-red-500">
							Something went wrong. Please try again.
						</p>
					)}

					<Modal.Close asChild>
						<Button
							$size="sm"
							$style="stroke"
							$type="neutral"
							className="w-full"
						>
							Maybe later
						</Button>
					</Modal.Close>

					<Button
						$size="sm"
						$type="primary"
						$style="filled"
						className="w-full"
						disabled={
							!resolvedAmount ||
							resolvedAmount < 100 ||
							createCheckout.isPending
						}
						onClick={handleSubmit}
						leadingIcon={
							createCheckout.isPending ? Loading03Icon : FavouriteIcon
						}
						leadingIconClassName={cn(
							createCheckout.isPending && "animate-spin",
							!createCheckout.isPending && "text-pink-200",
						)}
					>
						{createCheckout.isPending
							? "Redirecting to Stripe..."
							: `Donate${resolvedAmount ? ` $${(resolvedAmount / 100).toFixed(2)}` : ""}`}
					</Button>
				</Modal.Footer>

				<p className="pb-4 text-center text-(--text-soft-400) text-paragraph-xs">
					Payments are securely processed by Stripe.
				</p>
			</Modal.Content>
		</Modal.Root>
	);
}
DonateModal.displayName = "DonateModal";
