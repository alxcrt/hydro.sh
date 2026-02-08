import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button.tsx";

export const Route = createFileRoute("/donate-success")({
	component: DonateSuccessPage,
});

function WaterDropletIcon({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 36"
			fill="none"
			className={className}
		>
			<path
				d="M12 0C12 0 0 14 0 24C0 30.627 5.373 36 12 36C18.627 36 24 30.627 24 24C24 14 12 0 12 0Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function DonateSuccessPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-(--bg-white-0) p-4">
			<div className="relative max-w-md text-center">
				{/* Decorative background */}
				<div
					aria-hidden="true"
					className="-z-10 absolute inset-0 overflow-hidden"
				>
					<div className="-top-20 -left-20 absolute h-64 w-64 rounded-full bg-gradient-to-br from-blue-100 via-cyan-50 to-transparent opacity-60 blur-3xl" />
					<div className="-bottom-20 -right-20 absolute h-64 w-64 rounded-full bg-gradient-to-tl from-pink-100 via-transparent to-transparent opacity-40 blur-3xl" />
				</div>

				{/* Animated water drop */}
				<div className="mb-8 flex justify-center">
					<div className="relative">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100">
							<WaterDropletIcon className="h-8 w-5 animate-[float_3s_ease-in-out_infinite] text-blue-500" />
						</div>
						{/* Ripple rings */}
						<div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-200 opacity-20" />
					</div>
				</div>

				<h1 className="mb-3 font-semibold text-(--text-strong-950) text-2xl">
					You're amazing!
				</h1>

				<p className="mx-auto mb-2 max-w-sm text-(--text-sub-600) text-lg leading-relaxed">
					Thank you for your generous support.
				</p>

				<p className="mx-auto mb-8 max-w-sm text-(--text-soft-400) text-paragraph-sm leading-relaxed">
					Your donation directly helps keep Hydro.sh running and free for
					everyone. We truly appreciate it.
				</p>

				<div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
					<Button $type="primary" $style="filled" $size="md" asChild>
						<Link to="/">Back to Home</Link>
					</Button>

					<Button $type="neutral" $style="stroke" $size="md" asChild>
						<Link to="/dashboard">Go to Dashboard</Link>
					</Button>
				</div>

				{/* Float keyframes */}
				<style>{`
					@keyframes float {
						0%, 100% { transform: translateY(0); }
						50% { transform: translateY(-8px); }
					}
				`}</style>
			</div>
		</div>
	);
}
