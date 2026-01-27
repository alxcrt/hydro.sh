import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";

import { Link } from "@tanstack/react-router";

import { useORPC } from "@/hooks/use-orpc.ts";
import { cn } from "@/utils/cn.ts";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button.tsx";

// Animated water droplet SVG
function WaterDroplet({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 36"
			fill="none"
			className={cn("text-blue-500/20", className)}
		>
			<path
				d="M12 0C12 0 0 14 0 24C0 30.627 5.373 36 12 36C18.627 36 24 30.627 24 24C24 14 12 0 12 0Z"
				fill="currentColor"
			/>
		</svg>
	);
}

export function HeroSection({
	className,
	...props
}: React.ComponentPropsWithRef<"section">) {
	const { isLoading, isError } = useQuery(useORPC().healthCheck.queryOptions());

	return (
		<section
			id="hero"
			className={cn("relative px-2 lg:px-0", className)}
			{...props}
		>
			<div className="container relative max-w-6xl overflow-hidden border-x bg-(--bg-white-0) px-4 pt-28 pb-20 lg:px-8 lg:pt-36 lg:pb-28">
				{/* Background gradient decoration */}
				<div
					aria-hidden="true"
					className="-top-40 -right-40 absolute h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-100 via-cyan-50 to-transparent opacity-60 blur-3xl"
				/>
				<div
					aria-hidden="true"
					className="-bottom-20 -left-20 absolute h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-blue-50 via-transparent to-transparent opacity-50 blur-3xl"
				/>

				{/* Floating droplets decoration */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 overflow-hidden"
				>
					<WaterDroplet className="absolute top-24 left-[10%] h-9 w-6 animate-[float_6s_ease-in-out_infinite]" />
					<WaterDroplet className="absolute top-40 right-[15%] h-6 w-4 animate-[float_8s_ease-in-out_infinite_1s]" />
					<WaterDroplet className="absolute bottom-32 left-[20%] h-7 w-5 animate-[float_7s_ease-in-out_infinite_2s]" />
					<WaterDroplet className="absolute right-[25%] bottom-40 h-5 w-3 animate-[float_9s_ease-in-out_infinite_0.5s]" />
				</div>

				{/* Grid pattern overlay */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 opacity-[0.02]"
					style={{
						backgroundImage:
							"radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)",
						backgroundSize: "32px 32px",
					}}
				/>

				<div className="relative">
					<div className="mx-auto max-w-2xl text-center lg:pt-8">
						{/* Badge */}
						<div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-blue-700 text-label-sm">
							<span className="relative flex h-2 w-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
								<span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
							</span>
							Now supporting h2o smart bottles
						</div>

						{/* Headline */}
						<h1 className="text-pretty font-semibold text-(--text-strong-950) text-4xl tracking-tight lg:text-5xl xl:text-6xl">
							Track Your Hydration,{" "}
							<span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
								Effortlessly
							</span>
						</h1>

						{/* Subheadline */}
						<p className="mx-auto mt-6 max-w-xl text-pretty text-(--text-sub-600) text-lg leading-relaxed lg:text-xl">
							Connect your smart water bottle and automatically track every sip.
							Set daily goals, view your progress, and build healthier hydration
							habits.
						</p>

						{/* CTA Buttons */}
						<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Button
								trailingIcon={ArrowRight01Icon}
								trailingIconClassName="transition-transform duration-300 group-hover:translate-x-1"
								className="gap-2 shadow-blue-500/20 shadow-lg"
								$size="md"
								asChild
							>
								<Link to="/login">Get Started Free</Link>
							</Button>

							<Button $type="neutral" $style="stroke" $size="md" asChild>
								<a href="#features">See How It Works</a>
							</Button>
						</div>

						{/* Server status indicator */}
						<div className="mt-10 flex items-center justify-center gap-3">
							<div className="flex items-center gap-2 rounded-full border border-(--stroke-soft-200) bg-(--bg-weak-50) px-4 py-2 text-(--text-sub-600) text-paragraph-sm">
								<div
									className={cn(
										"size-2 rounded-full transition-colors",
										isLoading
											? "animate-pulse bg-amber-400"
											: isError
												? "bg-red-500"
												: "bg-emerald-500",
									)}
								/>
								{isLoading
									? "Connecting..."
									: isError
										? "Service Offline"
										: "All Systems Online"}
							</div>
						</div>
					</div>
				</div>

				{/* Bottom decorative line */}
				<div className="-translate-x-1/2 absolute bottom-0 left-1/2 h-px w-24 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
			</div>

			{/* Keyframes for floating animation */}
			<style>{`
				@keyframes float {
					0%, 100% {
						transform: translateY(0) rotate(0deg);
					}
					50% {
						transform: translateY(-20px) rotate(5deg);
					}
				}
			`}</style>
		</section>
	);
}
