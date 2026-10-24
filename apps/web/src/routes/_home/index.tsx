import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useORPC } from "@/hooks/use-orpc";
import { cn } from "@/utils/cn";

export const Route = createFileRoute("/_home/")({
	component: RouteComponent,
});

const features = [
	{
		icon: (
			<svg
				aria-hidden="true"
				className="h-5 w-5"
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
		description: "Connect via Bluetooth and track automatically",
	},
	{
		icon: (
			<svg
				aria-hidden="true"
				className="h-5 w-5"
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
		description: "Visual dashboard for daily, weekly, monthly trends",
	},
	{
		icon: (
			<svg
				aria-hidden="true"
				className="h-5 w-5"
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
		description: "Set personalized hydration targets",
	},
];

function RouteComponent() {
	const { isLoading, isError } = useQuery(useORPC().healthCheck.queryOptions());
	return (
		<div className="flex min-h-screen">
			{/* Left side - Hero Content */}
			<div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 p-12 lg:flex lg:w-1/2">
				{/* Background decoration */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white blur-3xl" />
					<div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-white blur-3xl" />
					<div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-50 blur-3xl" />
				</div>

				{/* Grid pattern overlay */}
				<div
					aria-hidden="true"
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage:
							"radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
						backgroundSize: "32px 32px",
					}}
				/>

				{/* Logo and brand */}
				<div className="relative z-10">
					<div className="flex items-center gap-3">
						<img src="/logo.png" alt="Hydro" className="h-10 w-10" />
						<span className="text-2xl font-bold text-white">hydro.sh</span>
					</div>
				</div>

				{/* Main content */}
				<div className="relative z-10 space-y-8">
					<div className="space-y-4">
						<div className="text-label-xs inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white backdrop-blur-sm">
							<span className="relative flex h-1.5 w-1.5">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
								<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
							</span>
							No app required - works in your browser
						</div>

						<h1 className="text-4xl leading-tight font-bold text-white xl:text-5xl">
							Track your hydration,
							<br />
							<span className="text-cyan-200">effortlessly.</span>
						</h1>

						<p className="max-w-md text-lg leading-relaxed text-blue-100">
							Connect your smart water bottle and automatically track every sip.
							Set daily goals, view your progress, and build healthier hydration
							habits.
						</p>
					</div>

					{/* Features list */}
					<div className="space-y-3 pt-2">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="flex items-start gap-3 text-white"
							>
								<div className="rounded-10 flex h-8 w-8 shrink-0 items-center justify-center bg-white/15 backdrop-blur-sm">
									{feature.icon}
								</div>
								<div className="pt-0.5">
									<div className="text-label-sm font-medium">
										{feature.title}
									</div>
									<div className="text-paragraph-xs text-blue-100/80">
										{feature.description}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Footer */}
				<div className="text-paragraph-sm relative z-10 flex items-center gap-3 text-blue-200">
					<div
						className={cn(
							"size-2 rounded-full transition-colors",
							isLoading
								? "animate-pulse bg-amber-300"
								: isError
									? "bg-red-400"
									: "bg-emerald-400",
						)}
					/>
					{isLoading
						? "Connecting..."
						: isError
							? "Service Offline"
							: "All Systems Online"}
				</div>
			</div>

			{/* Right side - CTA */}
			<div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2">
				<div className="w-full max-w-md">
					{/* Mobile logo */}
					<div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
						<img src="/logo.png" alt="Hydro" className="h-10 w-10" />
						<span className="text-2xl font-bold text-gray-900">hydro.sh</span>
					</div>

					{/* Mobile badge */}
					<div className="mb-6 flex justify-center lg:hidden">
						<div className="text-label-xs inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700">
							<span className="relative flex h-1.5 w-1.5">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
								<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
							</span>
							No app required - works in your browser
						</div>
					</div>

					<div className="text-center lg:text-left">
						<h2 className="text-label-xl text-neutral-950 lg:hidden">
							Track your hydration, effortlessly
						</h2>
						<h2 className="text-label-xl hidden text-neutral-950 lg:block">
							Ready to get started?
						</h2>
						<p className="text-paragraph-sm mt-2 text-neutral-500">
							Join thousands of users building healthier hydration habits with
							their smart water bottle.
						</p>
					</div>

					<div className="mt-8 space-y-3">
						<Button
							asChild
							$type="primary"
							$style="filled"
							$size="md"
							className="w-full gap-2"
							trailingIcon={ArrowRight01Icon}
							trailingIconClassName="transition-transform duration-300 group-hover:translate-x-1"
						>
							<Link to="/login">Get started free</Link>
						</Button>

						<Button
							asChild
							$type="neutral"
							$style="stroke"
							$size="md"
							className="w-full"
						>
							<Link to="/dashboard">Go to Dashboard</Link>
						</Button>
					</div>

					<div className="relative my-6 lg:hidden">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-neutral-200" />
						</div>
						<div className="relative flex justify-center">
							<span className="text-paragraph-xs bg-gray-50 px-3 text-neutral-400">
								or
							</span>
						</div>
					</div>

					<button
						type="button"
						onClick={() => {
							document
								.getElementById("features")
								?.scrollIntoView({ behavior: "smooth" });
						}}
						className="group rounded-10 text-label-sm flex w-full items-center justify-center gap-2 border border-neutral-200 bg-white px-4 py-2.5 text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 lg:hidden"
					>
						<svg
							aria-hidden="true"
							className="h-4 w-4 text-neutral-400 transition-colors group-hover:text-neutral-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
							/>
						</svg>
						Learn more about features
					</button>

					{/* Mobile features */}
					<div id="features" className="mt-8 space-y-3 lg:hidden">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="rounded-12 flex items-start gap-3 border border-neutral-200 bg-white p-3"
							>
								<div className="rounded-8 flex h-8 w-8 shrink-0 items-center justify-center bg-blue-50 text-blue-600">
									{feature.icon}
								</div>
								<div>
									<div className="text-label-sm text-neutral-900">
										{feature.title}
									</div>
									<div className="text-paragraph-xs text-neutral-500">
										{feature.description}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Mobile status */}
					<div className="text-paragraph-xs mt-6 flex items-center justify-center gap-2 text-neutral-500 lg:hidden">
						<div
							className={cn(
								"size-1.5 rounded-full transition-colors",
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

					<p className="text-paragraph-xs mt-6 text-center text-neutral-400">
						No credit card required. Free forever for personal use.
					</p>
				</div>
			</div>
		</div>
	);
}
