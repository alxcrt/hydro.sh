import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";

import { Link } from "@tanstack/react-router";

import { useORPC } from "@/hooks/use-orpc.ts";
import { cn } from "@/utils/cn.ts";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button.tsx";

export function HeroSection({
	className,
	...props
}: React.ComponentPropsWithRef<"section">) {
	const {
		data: healthCheck,
		isLoading,
		isError,
	} = useQuery(useORPC().healthCheck.queryOptions());

	return (
		<section
			id="hero"
			className={cn("relative px-2 lg:px-0", className)}
			{...props}
		>
			<div className="container relative max-w-6xl overflow-hidden border-x bg-(--bg-white-0) p-4 py-32 lg:px-8 lg:pb-80">
				<div
					aria-hidden="true"
					className="-mr-96 sm:-mr-80 lg:-mr-96 absolute inset-y-0 right-1/2 w-[200%] origin-top-right skew-x-[-30deg] bg-(--bg-white-0) shadow-blue-600/10 shadow-xl ring-1 ring-blue-50"
				/>

				<div className="relative">
					<div className="mx-auto max-w-2xl lg:mx-0 lg:shrink-0 lg:pt-8">
						<h1 className="text-pretty font-semibold text-h2 tracking-tighter lg:text-h1">
							Your Open Source Smart Water Bottle Companion
						</h1>

						<p className="mt-4 text-pretty text-(--text-sub-600) lg:text-paragraph-lg">
							Hydro.sh is the open source alternative that{" "}
							<strong>connects</strong>, <strong>tracks</strong>, and{" "}
							<strong>optimizes</strong> your hydration with LARQ and Hidrate
							smart water bottles.
						</p>

						<div className="mt-12 flex items-center gap-2">
							<Button
								trailingIcon={ArrowRight01Icon}
								trailingIconClassName="easy-out-in duration-300 group-hover:translate-x-1"
								className="w-full gap-2 lg:w-auto"
								asChild
							>
								<Link to="/login">Get started free</Link>
							</Button>

							<Button
								trailingIcon={ArrowRight01Icon}
								trailingIconClassName="easy-out-in duration-300 group-hover:translate-x-1"
								$style="lighter"
								className="w-full gap-2 lg:w-auto"
								asChild
							>
								{/* <Link to="/#features">See compatibility</Link> */}
							</Button>

							{/* Server status indicator */}
							<div className="flex items-center gap-1.5 rounded-full bg-(--bg-weak-50) px-3 py-1 font-medium text-sm">
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
										? healthCheck
											? "Connected"
											: "Disconnected"
										: "Connected"}
							</div>
						</div>
					</div>
				</div>

				<div className="-z-10 absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-(--bg-white-0) sm:h-32" />
			</div>
		</section>
	);
}
