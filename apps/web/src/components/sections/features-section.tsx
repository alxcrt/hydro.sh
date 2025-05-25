import ThirdBracketSquareIcon from "virtual:icons/hugeicons/3rd-bracket-square";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";
import ChipIcon from "virtual:icons/hugeicons/chip";
import CleanIcon from "virtual:icons/hugeicons/clean";
import SettingsIcon from "virtual:icons/hugeicons/settings-01";

import { Link } from "@tanstack/react-router";

import { cn } from "@/utils/cn.ts";
import { Button } from "../ui/button.tsx";

const features = [
	{
		icon: CleanIcon,
		id: "bottle-compatibility",
		title: "Multiple Bottle Support",
		description:
			"Connect with popular smart bottles including LARQ and Hidrate models with our open source integration platform.",
	},
	{
		icon: CleanIcon,
		id: "mobile-app",
		title: "Cross-Platform App",
		description:
			"Track your hydration on the go with our user-friendly mobile application available for both iOS and Android devices.",
	},
	{
		icon: CleanIcon,
		id: "hydration-tracking",
		title: "Detailed Hydration Analytics",
		description:
			"Monitor your daily water intake with comprehensive stats and visualizations to reach your hydration goals.",
	},
	{
		icon: CleanIcon,
		id: "smart-reminders",
		title: "Smart Reminders",
		description:
			"Receive personalized hydration reminders based on your activity level, local weather, and past drinking patterns.",
	},
	{
		icon: CleanIcon,
		id: "cloud-sync",
		title: "Seamless Cloud Sync",
		description:
			"Your hydration data automatically syncs across all your devices, ensuring you never lose track of your progress.",
	},
	{
		icon: CleanIcon,
		id: "privacy-focused",
		title: "Privacy-Focused",
		description:
			"As an open source solution, we prioritize your data privacy with full transparency on how your information is used.",
	},
	{
		icon: SettingsIcon,
		id: "customization",
		title: "Full Customization",
		description:
			"Tailor the app to your preferences with customizable goals, reminders, and detailed bottle configuration options.",
	},
	{
		icon: ThirdBracketSquareIcon,
		id: "developer-api",
		title: "Developer API",
		description:
			"Extend functionality with our comprehensive API, allowing developers to build integrations with other health applications.",
	},
];

export function FeaturesSection({
	className,
	...props
}: React.ComponentPropsWithRef<"section">) {
	return (
		<section id="features" className={cn("px-2 lg:px-0", className)} {...props}>
			<div className="container max-w-6xl border-x border-t bg-(--bg-white-0) py-12 lg:px-12">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-end">
					<div className="lg:col-span-2">
						<p className="flex items-center gap-2">
							<ChipIcon className="size-4 text-primary" />
							<span className="font-medium text-(--text-sub-600) text-paragraph-sm uppercase">
								SMART WATER BOTTLE COMPANION
							</span>
						</p>

						<h3 className="mt-8 font-semibold text-h4 tracking-tight">
							Open Source Alternative for Smart Hydration
						</h3>
						<p className="mt-2 text-(--text-sub-600) text-paragraph-lg">
							Hydro.sh provides a free, open source alternative to connect with
							and maximize your smart water bottles from LARQ, Hidrate, and
							more. Track your hydration goals with complete data privacy and
							customization.
						</p>

						<div className="mt-8 flex items-center gap-2">
							<Button
								asChild
								trailingIcon={ArrowRight01Icon}
								trailingIconClassName="easy-out-in duration-300 group-hover:translate-x-1"
								className="gap-2"
							>
								<Link to="/login">Get started now</Link>
							</Button>
							<Button
								$style="lighter"
								trailingIcon={ArrowRight01Icon}
								trailingIconClassName="easy-out-in duration-300 group-hover:translate-x-1"
								asChild
								className="gap-2"
							>
								<a href="mailto:support@hydro.sh">Contact us</a>
							</Button>
						</div>
					</div>
				</div>

				<dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{features.map((feature) => (
						<div key={feature.id}>
							<dt className="flex items-center gap-2">
								<feature.icon className="size-6 text-primary" />
								<h3 className="font-medium text-paragraph-sm">
									{feature.title}
								</h3>
							</dt>
							<dd>
								<p className="mt-2 text-(--text-sub-600) text-paragraph-sm">
									{feature.description}
								</p>
							</dd>
						</div>
					))}
				</dl>
			</div>
		</section>
	);
}
