import { Outlet, redirect } from "@tanstack/react-router";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	async beforeLoad({ context }) {
		if (context.session?.id) {
			throw redirect({
				to: "/dashboard",
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex min-h-screen">
			{/* Left side - Branding */}
			<div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 p-12 lg:flex lg:w-1/2">
				{/* Background decoration */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white blur-3xl" />
					<div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-white blur-3xl" />
				</div>

				{/* Logo and brand */}
				<div className="relative z-10">
					<div className="flex items-center gap-3">
						<img src="/logo.png" alt="Hydro" className="h-10 w-10" />
						<span className="font-bold text-2xl text-white">hydro.sh</span>
					</div>
				</div>

				{/* Main content */}
				<div className="relative z-10 space-y-6">
					<h1 className="font-bold text-4xl text-white leading-tight">
						Track your hydration,
						<br />
						stay healthy.
					</h1>
					<p className="max-w-md text-blue-100 text-lg">
						Connect your smart water bottle and effortlessly monitor your daily
						water intake. Set goals, track progress, and build better hydration
						habits.
					</p>

					{/* Features */}
					<div className="space-y-4 pt-4">
						<div className="flex items-center gap-3 text-white">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
								<svg
									aria-hidden="true"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<span>Automatic sync with smart bottles</span>
						</div>
						<div className="flex items-center gap-3 text-white">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
								<svg
									aria-hidden="true"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<span>Visual progress tracking</span>
						</div>
						<div className="flex items-center gap-3 text-white">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
								<svg
									aria-hidden="true"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<span>Daily goals and reminders</span>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="relative z-10 text-blue-200 text-sm">
					Stay hydrated, stay healthy.
				</div>
			</div>

			{/* Right side - Form */}
			<div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2">
				<div className="w-full max-w-md">
					{/* Mobile logo */}
					<div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
						<img src="/logo.png" alt="Hydro" className="h-10 w-10" />
						<span className="font-bold text-2xl text-gray-900">hydro.sh</span>
					</div>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
