"use client";

import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";
import DashboardSquare02Icon from "virtual:icons/hugeicons/dashboard-square-02";
import FavouriteIcon from "virtual:icons/hugeicons/favourite";

import { Link, useLocation } from "@tanstack/react-router";
import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { cn } from "@/utils/cn";
import { Logo } from "./logo.tsx";
import { DonateModal } from "./modals/donate-modal.tsx";
import * as Divider from "./ui/divider.tsx";
import { UserButton } from "./user-button.tsx";

type NavigationLink = {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	to: string;
	disabled?: boolean;
};

export const navigationLinks: NavigationLink[] = [
	{ icon: DashboardSquare02Icon, label: "Dashboard", to: "/dashboard" },
];

function useCollapsedState({
	defaultCollapsed = false,
}: {
	defaultCollapsed?: boolean;
}) {
	const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
	const sidebarRef = React.useRef<HTMLDivElement>(null);

	useHotkeys(
		["ctrl+b", "meta+b"],
		() => setCollapsed((prev) => !prev),
		{ preventDefault: true },
		[collapsed],
	);

	React.useEffect(() => {
		if (!sidebarRef.current) return;

		const elementsToHide = sidebarRef.current.querySelectorAll(
			"[data-hide-collapsed]",
		);

		const listeners: { el: Element; listener: EventListener }[] = [];

		for (const el of elementsToHide) {
			const hideListener = () => {
				el.classList.add("hidden");
				el.classList.remove("transition", "duration-300");
			};

			const showListener = () => {
				el.classList.remove("transition", "duration-300");
			};

			if (collapsed) {
				el.classList.add("opacity-0", "transition", "duration-300");
				el.addEventListener("transitionend", hideListener, { once: true });
				listeners.push({ el, listener: hideListener });
			} else {
				el.classList.add("transition", "duration-300");
				el.classList.remove("hidden");
				setTimeout(() => {
					el.classList.remove("opacity-0");
				}, 1);
				el.addEventListener("transitionend", showListener, { once: true });
				listeners.push({ el, listener: showListener });
			}
		}
		return () => {
			for (const { el, listener } of listeners) {
				el.removeEventListener("transitionend", listener);
			}
		};
	}, [collapsed]);

	return { collapsed, sidebarRef };
}

export function SidebarHeader({ collapsed }: { collapsed?: boolean }) {
	return (
		<div
			className={cn("lg:p-3", {
				"lg:px-2": collapsed,
			})}
		>
			<div className="flex w-full items-center gap-3 whitespace-nowrap p-3 text-left outline-none focus:outline-none">
				<Link to="/" className="flex items-center gap-2">
					<Logo className="h-10 w-auto text-primary" />
					<span className="font-semibold" data-hide-collapsed>
						Hydro.sh
					</span>
				</Link>
			</div>
		</div>
	);
}

function NavigationMenu({ collapsed }: { collapsed: boolean }) {
	const pathname = useLocation().pathname;

	return (
		<div className="space-y-2">
			<div
				className={cn(
					"p-1 text-(--text-soft-400) text-subheading-xs uppercase",
					{
						"-mx-2.5 w-14 px-0 text-center": collapsed,
					},
				)}
			>
				Main
			</div>
			<div className="space-y-1">
				{navigationLinks.map(({ icon: Icon, label, to, disabled }) => (
					<Link
						key={to}
						to={to}
						aria-current={pathname === to ? "page" : undefined}
						aria-disabled={disabled}
						className={cn(
							"group relative flex items-center gap-2 whitespace-nowrap rounded-8 py-2 text-(--text-sub-600) hover:bg-(--bg-weak-50)",
							"transition duration-200 ease-out",
							"aria-[current=page]:bg-(--bg-weak-50)",
							"aria-disabled:pointer-events-none aria-disabled:opacity-50",
							{
								"w-9 px-2": collapsed,
								"w-full px-3": !collapsed,
							},
						)}
					>
						<div
							className={cn(
								"-translate-y-1/2 absolute top-1/2 h-5 w-1 origin-left rounded-r-full bg-primary transition duration-200 ease-out",
								{
									"-left-[22px]": collapsed,
									"-left-5": !collapsed,
									"scale-100": pathname === to,
									"scale-0": pathname !== to,
								},
							)}
						/>
						<Icon
							className={cn(
								"size-5 shrink-0 text-(--text-sub-600) transition duration-200 ease-out",
								"group-aria-[current=page]:text-primary",
							)}
						/>

						<div
							className="flex w-[180px] shrink-0 items-center gap-2"
							data-hide-collapsed
						>
							<div className="flex-1 text-label-sm">{label}</div>
							{pathname === to && (
								<ArrowRight01Icon className="size-5 text-(--text-sub-600)" />
							)}
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

function UserProfile({ collapsed }: { collapsed: boolean }) {
	return (
		<div
			className={cn("p-3", {
				"px-2": collapsed,
			})}
		>
			<UserButton
				className={cn("transition-all-default", {
					"w-auto": collapsed,
				})}
			/>
		</div>
	);
}

function SidebarDivider({ collapsed }: { collapsed: boolean }) {
	return (
		<div className="px-5">
			<Divider.Root
				className={cn("transition-all-default", {
					"w-10": collapsed,
				})}
			/>
		</div>
	);
}

function GitHubLink({ collapsed }: { collapsed: boolean }) {
	return (
		<a
			href="https://github.com/alxcrt/hydro.sh"
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				"group flex items-center gap-2 whitespace-nowrap rounded-8 py-2 text-(--text-soft-400) hover:bg-(--bg-weak-50) hover:text-(--text-sub-600)",
				"transition duration-200 ease-out",
				{
					"w-9 justify-center px-2": collapsed,
					"w-full px-3": !collapsed,
				},
			)}
		>
			<svg
				aria-hidden="true"
				className="size-5 shrink-0 transition duration-200 ease-out"
				viewBox="0 0 16 16"
				fill="currentColor"
			>
				<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
			</svg>
			<span className="text-label-sm" data-hide-collapsed>
				GitHub
			</span>
		</a>
	);
}

function DonateLink({ collapsed }: { collapsed: boolean }) {
	const [donateOpen, setDonateOpen] = React.useState(false);

	return (
		<>
			<DonateModal open={donateOpen} onOpenChange={setDonateOpen} />
			<button
				type="button"
				onClick={() => setDonateOpen(true)}
				className={cn(
					"group flex items-center gap-2 whitespace-nowrap rounded-8 py-2 text-(--text-soft-400) hover:bg-pink-50 hover:text-pink-600",
					"transition duration-200 ease-out",
					{
						"w-9 justify-center px-2": collapsed,
						"w-full px-3": !collapsed,
					},
				)}
			>
				<FavouriteIcon className="size-5 shrink-0 text-pink-400 transition duration-200 ease-out group-hover:text-pink-500" />
				<span className="text-label-sm" data-hide-collapsed>
					Support me
				</span>
			</button>
		</>
	);
}

export default function Sidebar({
	defaultCollapsed = false,
}: {
	defaultCollapsed?: boolean;
}) {
	const { collapsed, sidebarRef } = useCollapsedState({ defaultCollapsed });

	return (
		<>
			<div
				className={cn(
					"fixed top-0 left-0 z-40 hidden h-full overflow-hidden border-(--stroke-soft-200) border-r bg-(--bg-white-0) transition-all-default duration-300 lg:block",
					{
						"w-20": collapsed,
						"w-[272px]": !collapsed,
						"[&_[data-hide-collapsed]]:hidden": !collapsed
							? false
							: defaultCollapsed,
					},
				)}
			>
				<div
					ref={sidebarRef}
					className="flex h-full w-[272px] min-w-[272px] flex-col overflow-auto"
				>
					<SidebarHeader collapsed={collapsed} />

					<SidebarDivider collapsed={collapsed} />

					<div
						className={cn("flex flex-1 flex-col gap-5 pt-5 pb-4", {
							"px-[22px]": collapsed,
							"px-5": !collapsed,
						})}
					>
						<NavigationMenu collapsed={collapsed} />

						<div className="mt-auto space-y-0.5">
							<GitHubLink collapsed={collapsed} />
							<DonateLink collapsed={collapsed} />
						</div>
					</div>

					<SidebarDivider collapsed={collapsed} />

					<UserProfile collapsed={collapsed} />
				</div>
			</div>

			{/* a necessary placeholder because of sidebar is fixed */}
			<div
				className={cn("shrink-0", {
					"w-[272px]": !collapsed,
					"w-20": collapsed,
				})}
			/>
		</>
	);
}
