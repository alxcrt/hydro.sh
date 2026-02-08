import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button.tsx";

export const Route = createFileRoute("/donate-cancel")({
	component: DonateCancelPage,
});

function DonateCancelPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-(--bg-white-0) p-4">
			<div className="relative max-w-md text-center">
				{/* Decorative background */}
				<div
					aria-hidden="true"
					className="-z-10 absolute inset-0 overflow-hidden"
				>
					<div className="-top-20 -left-20 absolute h-64 w-64 rounded-full bg-gradient-to-br from-blue-50 via-transparent to-transparent opacity-40 blur-3xl" />
				</div>

				{/* Icon */}
				<div className="mb-8 flex justify-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--bg-weak-50)">
						<svg
							aria-hidden="true"
							className="h-7 w-5 text-(--text-soft-400)"
							viewBox="0 0 24 36"
							fill="currentColor"
						>
							<path d="M12 0C12 0 0 14 0 24C0 30.627 5.373 36 12 36C18.627 36 24 30.627 24 24C24 14 12 0 12 0Z" />
						</svg>
					</div>
				</div>

				<h1 className="mb-3 font-semibold text-(--text-strong-950) text-2xl">
					No worries!
				</h1>

				<p className="mx-auto mb-8 max-w-sm text-(--text-sub-600) text-paragraph-sm leading-relaxed">
					Hydro.sh is free and always will be. Using the app and staying
					hydrated is the best support you can give.
				</p>

				<div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
					<Button $type="primary" $style="filled" $size="md" asChild>
						<Link to="/">Back to Home</Link>
					</Button>

					<Button $type="neutral" $style="stroke" $size="md" asChild>
						<Link to="/dashboard">Go to Dashboard</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
