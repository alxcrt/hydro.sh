"use client";

import ArrowDown01Icon from "virtual:icons/hugeicons/arrow-down-01";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";
import Logout04Icon from "virtual:icons/hugeicons/logout-04";
import Moon02Icon from "virtual:icons/hugeicons/moon-02";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "next-themes";

import { useMe } from "@/hooks/use-me.ts";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/utils/cn";
import * as Avatar from "./ui/avatar.tsx";
import * as Divider from "./ui/divider.tsx";
import * as DropdownMenu from "./ui/dropdown-menu.tsx";
import { Skeleton } from "./ui/skeleton.tsx";
import * as Switch from "./ui/switch.tsx";

export function UserButton({ className }: { className?: string }) {
	const me = useMe();
	const { theme, setTheme } = useTheme();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				className={cn(
					"rounded-10 flex w-full items-center gap-3 p-3 text-left whitespace-nowrap outline-none hover:bg-(--bg-weak-50) focus:outline-none",
					className,
				)}
			>
				{me ? (
					<Avatar.Root
						className="fade-in animate-in duration-300"
						$color="blue"
						$size="40"
					>
						{me.fullName?.charAt(0) ?? ""}
					</Avatar.Root>
				) : (
					<Skeleton className="size-10 rounded-full" />
				)}

				<div
					className="flex w-[172px] shrink-0 items-center gap-3"
					data-hide-collapsed
				>
					<div className="flex-1 space-y-1">
						{me ? (
							<div className="fade-in animate-in text-label-sm flex items-center gap-0.5 duration-300">
								{me.fullName}
							</div>
						) : (
							<Skeleton className="h-5" />
						)}

						{me ? (
							<div className="fade-in animate-in text-paragraph-xs truncate text-(--text-sub-600) duration-300">
								{me.email}
							</div>
						) : (
							<Skeleton className="h-4" />
						)}
					</div>

					<div className="rounded-6 flex size-6 items-center justify-center">
						<ArrowRight01Icon className="size-5 text-(--text-sub-600)" />
					</div>
				</div>
			</DropdownMenu.Trigger>

			<DropdownMenu.Content align="end" side="right" sideOffset={24}>
				<DropdownMenu.Item
					onSelect={(e) => {
						e.preventDefault();
						setTheme(theme === "dark" ? "light" : "dark");
					}}
				>
					<DropdownMenu.ItemIcon
						className="text-(--text-strong-950)"
						as={Moon02Icon}
					/>
					Dark Mode
					<span className="flex-1" />
					<Switch.Root checked={theme === "dark"} />
				</DropdownMenu.Item>

				<Divider.Root $type="line-spacing" />

				<DropdownMenu.Group>
					<DropdownMenu.Item
						onClick={() => {
							authClient.signOut({
								fetchOptions: {
									onSuccess: () => {
										queryClient.clear();
										navigate({
											to: "/",
										});
									},
								},
							});
						}}
					>
						<DropdownMenu.ItemIcon as={Logout04Icon} />
						Logout
					</DropdownMenu.Item>
				</DropdownMenu.Group>

				<div className="text-paragraph-sm p-2 text-(--text-soft-400)">
					<span>v1.0.0</span>
				</div>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}

export function UserButtonMobile({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme();
	const me = useMe();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return (
		<DropdownMenu.Root modal={false}>
			<DropdownMenu.Trigger
				className={cn(
					"group rounded-10 flex w-full items-center gap-3 p-3 text-left whitespace-nowrap outline-none hover:bg-(--bg-weak-50) focus:outline-none",
					className,
				)}
			>
				<Avatar.Root $color="blue" $size="48">
					{me?.fullName?.charAt(0) ?? ""}
				</Avatar.Root>
				<div className="flex-1 space-y-1">
					<div className="text-label-md flex items-center gap-0.5">
						{me?.fullName}
					</div>
					<div className="text-paragraph-sm truncate text-(--text-sub-600)">
						{me?.email}
					</div>
				</div>
				<div
					className={cn(
						"rounded-6 flex size-6 items-center justify-center border border-(--stroke-soft-200) bg-(--bg-white-0) text-(--text-sub-600) shadow-xs",
						"group-data-[state=open]:bg-(--bg-strong-950) group-data-[state=open]:text-(--text-white-0) group-data-[state=open]:shadow-none",
					)}
				>
					<ArrowDown01Icon className="size-5 group-data-[state=open]:-rotate-180" />
				</div>
			</DropdownMenu.Trigger>

			<DropdownMenu.Content align="end" side="top">
				<DropdownMenu.Item
					onSelect={(e) => {
						e.preventDefault();
						setTheme(theme === "dark" ? "light" : "dark");
					}}
				>
					<DropdownMenu.ItemIcon
						className="text-(--text-strong-950)"
						as={Moon02Icon}
					/>
					Dark Mode
					<span className="flex-1" />
					<Switch.Root checked={theme === "dark"} />
				</DropdownMenu.Item>

				<Divider.Root $type="line-spacing" />

				<DropdownMenu.Group>
					<DropdownMenu.Item
						onClick={() => {
							authClient.signOut({
								fetchOptions: {
									onSuccess: () => {
										queryClient.clear();
										navigate({
											to: "/",
										});
									},
								},
							});
						}}
					>
						<DropdownMenu.ItemIcon as={Logout04Icon} />
						Logout
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
