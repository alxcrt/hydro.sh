import { cn } from "@/utils/cn.ts";

const features = [
	{
		icon: (
			<svg
				aria-hidden="true"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
				/>
			</svg>
		),
		title: "Automatic Sync",
		description:
			"Connect via Bluetooth and your water intake is tracked automatically. No manual logging required.",
		color: "blue",
	},
	{
		icon: (
			<svg
				aria-hidden="true"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
				/>
			</svg>
		),
		title: "Progress Tracking",
		description:
			"Visual dashboard shows your daily, weekly, and monthly hydration trends at a glance.",
		color: "cyan",
	},
	{
		icon: (
			<svg
				aria-hidden="true"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		),
		title: "Daily Goals",
		description:
			"Set personalized hydration goals and track your progress throughout the day.",
		color: "teal",
	},
	{
		icon: (
			<svg
				aria-hidden="true"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
				/>
			</svg>
		),
		title: "Works on Any Device",
		description:
			"Access your hydration data from your phone, tablet, or computer. Your data syncs everywhere.",
		color: "blue",
	},
	{
		icon: (
			<svg
				aria-hidden="true"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
				/>
			</svg>
		),
		title: "Customizable LED",
		description:
			"Personalize your bottle's LED colors directly from the app to match your style.",
		color: "cyan",
	},
	{
		icon: (
			<svg
				aria-hidden="true"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
				/>
			</svg>
		),
		title: "Manual Entry",
		description:
			"Forgot your smart bottle? Manually log water intake from any source to keep your data complete.",
		color: "teal",
	},
];

const colorStyles = {
	blue: {
		bg: "bg-blue-50",
		iconBg: "bg-blue-100",
		iconText: "text-blue-600",
		border: "border-blue-100",
		hoverBorder: "hover:border-blue-200",
		hoverBg: "hover:bg-blue-50/50",
	},
	cyan: {
		bg: "bg-cyan-50",
		iconBg: "bg-cyan-100",
		iconText: "text-cyan-600",
		border: "border-cyan-100",
		hoverBorder: "hover:border-cyan-200",
		hoverBg: "hover:bg-cyan-50/50",
	},
	teal: {
		bg: "bg-teal-50",
		iconBg: "bg-teal-100",
		iconText: "text-teal-600",
		border: "border-teal-100",
		hoverBorder: "hover:border-teal-200",
		hoverBg: "hover:bg-teal-50/50",
	},
};

export function FeaturesSection({
	className,
	...props
}: React.ComponentPropsWithRef<"section">) {
	return (
		<section
			id="features"
			className={cn("relative px-2 lg:px-0", className)}
			{...props}
		>
			<div className="container max-w-6xl border-x bg-(--bg-white-0) px-4 py-16 lg:px-8 lg:py-24">
				{/* Section Header */}
				<div className="mb-12 text-center lg:mb-16">
					<div className="mb-4 inline-flex items-center gap-2">
						<span className="h-px w-8 bg-gradient-to-r from-transparent to-blue-300" />
						<span className="text-blue-600 text-label-sm uppercase tracking-wider">
							Features
						</span>
						<span className="h-px w-8 bg-gradient-to-l from-transparent to-blue-300" />
					</div>
					<h2 className="font-semibold text-(--text-strong-950) text-3xl lg:text-4xl">
						Everything you need to{" "}
						<span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
							stay hydrated
						</span>
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-(--text-sub-600) text-lg">
						Simple, powerful features designed to help you build better
						hydration habits.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
					{features.map((feature) => {
						const colors =
							colorStyles[feature.color as keyof typeof colorStyles];
						return (
							<div
								key={feature.title}
								className={cn(
									"group relative rounded-2xl border bg-(--bg-white-0) p-6 transition-all duration-300",
									colors.border,
									colors.hoverBorder,
									colors.hoverBg,
								)}
							>
								{/* Icon */}
								<div
									className={cn(
										"mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
										colors.iconBg,
										colors.iconText,
									)}
								>
									{feature.icon}
								</div>

								{/* Title */}
								<h3 className="mb-2 font-semibold text-(--text-strong-950) text-lg">
									{feature.title}
								</h3>

								{/* Description */}
								<p className="text-(--text-sub-600) text-paragraph-sm leading-relaxed">
									{feature.description}
								</p>

								{/* Decorative corner accent */}
								<div
									className={cn(
										"-z-10 absolute top-4 right-4 h-8 w-8 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100",
										colors.bg,
									)}
								/>
							</div>
						);
					})}
				</div>

				{/* Bottom decoration */}
				<div className="mt-16 flex justify-center">
					<div className="flex items-center gap-3 text-(--text-soft-400)">
						<div className="h-px w-12 bg-gradient-to-r from-transparent to-(--stroke-soft-200)" />
						<svg
							aria-hidden="true"
							className="h-6 w-4"
							viewBox="0 0 24 36"
							fill="currentColor"
						>
							<path d="M12 0C12 0 0 14 0 24C0 30.627 5.373 36 12 36C18.627 36 24 30.627 24 24C24 14 12 0 12 0Z" />
						</svg>
						<div className="h-px w-12 bg-gradient-to-l from-transparent to-(--stroke-soft-200)" />
					</div>
				</div>
			</div>
		</section>
	);
}
