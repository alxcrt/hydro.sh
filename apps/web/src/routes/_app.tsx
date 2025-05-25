import { SettingsModal } from "@/components/modals/settings-modal/settings-modal";
import Sidebar from "@/components/sidebar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<div className="flex min-h-screen flex-col items-start lg:grid lg:grid-cols-[auto_minmax(0,1fr)]">
				<Sidebar />

				<div className="relative z-50 mx-auto flex w-full max-w-[1360px] flex-1 flex-col self-stretch">
					<Outlet />
				</div>
			</div>

			<SettingsModal />
		</>
	);
}
