import FavouriteIcon from "virtual:icons/hugeicons/favourite";

import type * as React from "react";

import { cn } from "@/utils/cn.ts";
import { Button } from "./ui/button.tsx";

export function DonateButton({
	variant = "default",
	className,
	onClick,
	...rest
}: {
	variant?: "default" | "compact";
	onClick?: () => void;
} & Omit<React.ComponentPropsWithRef<"button">, "onClick">) {
	if (variant === "compact") {
		return (
			<Button
				$type="neutral"
				$style="ghost"
				$size="sm"
				leadingIcon={FavouriteIcon}
				leadingIconClassName="text-pink-500"
				className={cn("text-(--text-sub-600) hover:text-pink-600", className)}
				onClick={onClick}
				{...rest}
			>
				Donate
			</Button>
		);
	}

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"group inline-flex items-center gap-2.5 rounded-full border border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 px-5 py-2.5",
				"text-label-sm text-pink-700",
				"transition-all duration-300 ease-out",
				"hover:border-pink-300 hover:from-pink-100 hover:to-rose-100 hover:shadow-md hover:shadow-pink-200/50",
				"active:scale-[0.98]",
				className,
			)}
			{...rest}
		>
			<FavouriteIcon className="size-4 text-pink-500 transition-transform duration-300 group-hover:scale-110" />
			Support Hydro.sh
		</button>
	);
}
DonateButton.displayName = "DonateButton";
