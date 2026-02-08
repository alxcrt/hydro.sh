"use client";

import SodaIcon from "virtual:icons/hugeicons/soda-can-stroke-rounded";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import { useActionsParams } from "@/hooks/use-actions-params.ts";
import { useMe } from "@/hooks/use-me.ts";
import { useORPC } from "@/hooks/use-orpc.ts";
import { useBluetooth } from "@/hooks/useBluetooth.ts";
import { cn } from "@/utils/cn.ts";
import { useEffect } from "react";
import { useAppForm } from "../forms/form.tsx";
import { Button } from "../ui/button.tsx";
import * as Modal from "../ui/modal.tsx";
import * as AlertToast from "../ui/toast-alert.tsx";
import { toast } from "../ui/toast.tsx";

function useBluetoothSupport() {
	const [isSupported, setIsSupported] = React.useState(true);

	React.useEffect(() => {
		setIsSupported(
			typeof navigator !== "undefined" && "bluetooth" in navigator,
		);
	}, []);

	return isSupported;
}

export function AddDeviceModal() {
	const { setParams, ...params } = useActionsParams();
	const queryClient = useQueryClient();
	const me = useMe();
	const isBluetoothSupported = useBluetoothSupport();
	// const userPlan = me?.requestLimits?.plan ?? "free";
	const { connect, isConnecting, device, isConnected } = useBluetooth();

	const orpc = useORPC();
	const { mutateAsync } = useMutation(orpc.devices.create.mutationOptions());

	const form = useAppForm({
		defaultValues: {
			name: "",
			bluetoothName: "",
			id: "",
		},
		async onSubmit({ value }) {
			try {
				await mutateAsync({
					name: value.name,
					bluetoothName: value.bluetoothName,
					deviceIdentifier: value.id,
				});

				handleClose();
			} catch (err) {
				console.error("Error creating device:", err);
				toast.custom((t) => (
					<AlertToast.Root
						t={t}
						$status="error"
						$variant="filled"
						message="Failed to add device"
					/>
				));
				return;
			}

			await queryClient.invalidateQueries({
				queryKey: orpc.devices.list.queryOptions().queryKey,
			});
		},
	});

	const handleClose = async () => {
		await setParams({ action: null, resource: null });

		form.reset();
	};

	useEffect(() => {
		if (device) {
			form.setFieldValue("name", device.name || "My Device");
			form.setFieldValue("id", device.id || "My Device");
			form.setFieldValue("bluetoothName", device.name || "My Device");
		}
	}, [device, form.setFieldValue]);

	return (
		<Modal.Root
			open={params.action === "add" && params.resource === "device"}
			onOpenChange={handleClose}
		>
			<form.AppForm>
				<Modal.Content>
					<Modal.Header
						title="Add Device"
						description="Add a new device to your account"
						icon={SodaIcon}
					/>

					<Modal.Body>
						<form
							id="create-api-key-form"
							className="grid gap-6"
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								void form.handleSubmit();
							}}
						>
							<div className="grid gap-3">
								{device ? null : isBluetoothSupported ? (
									<Button
										$type="neutral"
										className="w-full"
										disabled={isConnecting}
										onClick={connect}
									>
										{isConnecting ? "Connecting..." : "Start Scanning"}
									</Button>
								) : (
									<div className="relative overflow-hidden rounded-12 border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/60 p-5">
										{/* Decorative background drop */}
										<div className="-right-3 -bottom-3 pointer-events-none absolute text-blue-100/50">
											<svg
												aria-hidden="true"
												className="h-24 w-18"
												viewBox="0 0 24 36"
												fill="currentColor"
											>
												<path d="M12 0C12 0 0 14 0 24C0 30.627 5.373 36 12 36C18.627 36 24 30.627 24 24C24 14 12 0 12 0Z" />
											</svg>
										</div>

										<div className="relative space-y-4">
											<div className="flex items-start gap-3">
												<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-10 bg-gradient-to-br from-blue-100 to-cyan-100">
													<svg
														aria-hidden="true"
														className="h-4.5 w-4.5 text-blue-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth={2}
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M6.343 17.657A8 8 0 1117.657 6.343M12 9v4m0 4h.01"
														/>
													</svg>
												</div>
												<div>
													<p className="font-semibold text-(--text-strong-950) text-label-sm">
														Bluetooth not available
													</p>
													<p className="mt-1 text-(--text-sub-600) text-paragraph-xs leading-relaxed">
														Your browser doesn't support Web Bluetooth, which is
														needed to pair smart bottles.
													</p>
												</div>
											</div>

											{/* Supported browsers */}
											<div className="flex items-center gap-2 rounded-10 bg-white/70 px-3 py-2.5 ring-1 ring-blue-100/80">
												<span className="shrink-0 text-(--text-soft-400) text-paragraph-xs">
													Supported:
												</span>
												<div className="flex items-center gap-3">
													{[
														{ name: "Chrome", color: "text-blue-600" },
														{ name: "Edge", color: "text-cyan-600" },
														{ name: "Opera", color: "text-teal-600" },
													].map((browser) => (
														<span
															key={browser.name}
															className={cn(
																"inline-flex items-center gap-1 font-medium text-label-xs",
																browser.color,
															)}
														>
															<span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
															{browser.name}
														</span>
													))}
												</div>
											</div>
										</div>
									</div>
								)}

								{device ? (
									<form.AppField
										name="name"
										children={(field) => (
											<field.TextField
												autoComplete="off"
												placeholder="Enter a name for your device"
												id="name"
												label="Name"
												name="name"
												hint="A friendly name to identify this device"
											/>
										)}
									/>
								) : null}
							</div>
						</form>
					</Modal.Body>

					<Modal.Footer>
						<Modal.Close asChild>
							<Button
								$size="sm"
								$style="stroke"
								$type="neutral"
								className="w-full"
								disabled={form.state.isSubmitting}
								onClick={handleClose}
							>
								Cancel
							</Button>
						</Modal.Close>

						<form.SubmitButton
							$size="sm"
							className="w-full"
							disabled={form.state.isSubmitting || !isBluetoothSupported}
							form="create-api-key-form"
							type="submit"
						>
							{form.state.isSubmitting ? "Creating..." : "Create"}
						</form.SubmitButton>
					</Modal.Footer>
				</Modal.Content>
			</form.AppForm>
		</Modal.Root>
	);
}
