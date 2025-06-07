"use client";

import Alert01SolidIcon from "virtual:icons/hugeicons/alert-01-solid";
import SodaIcon from "virtual:icons/hugeicons/soda-can-stroke-rounded";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import { useActionsParams } from "@/hooks/use-actions-params.ts";
import { useMe } from "@/hooks/use-me.ts";
import { useORPC } from "@/hooks/use-orpc.ts";
import { useBluetooth } from "@/hooks/useBluetooth.ts";
import { useEffect } from "react";
import { useAppForm } from "../forms/form.tsx";
import * as Alert from "../ui/alert.tsx";
import { Button } from "../ui/button.tsx";
import * as Modal from "../ui/modal.tsx";
import * as AlertToast from "../ui/toast-alert.tsx";
import { toast } from "../ui/toast.tsx";

export function AddDeviceModal() {
	const { setParams, ...params } = useActionsParams();
	const [key, setKey] = React.useState<string | null>(null);
	const queryClient = useQueryClient();
	const me = useMe();
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
			// if (!userPlan) {
			//   toast.custom((t) => (
			//     <AlertToast.Root
			//       t={t}
			//       $status="error"
			//       $variant="filled"
			//       message="You need to have a valid plan to create an API key"
			//     />
			//   ));
			//   return;
			// }

			console.log(value);

			try {
				await mutateAsync({
					name: value.name,
					bluetoothName: value.bluetoothName,
					deviceIdentifier: value.id,
				});

				handleClose();

				// Store the result for later use
				// You can uncomment and adapt the setKey code if needed
				// setKey(result.id);
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

			// if (error) {
			//   toast.custom((t) => (
			//     <AlertToast.Root
			//       t={t}
			//       $status="error"
			//       $variant="filled"
			//       message={error.message ?? ""}
			//     />
			//   ));
			//   return;
			// }

			// setKey(data.key);
			// await queryClient.invalidateQueries({ queryKey: ["devices", "list"] });
			await queryClient.invalidateQueries({
				queryKey: orpc.devices.list.queryOptions().queryKey,
			});
		},
		// validators: {
		//   onSubmit: CreateApiKeySchema,
		// },
	});

	const handleClose = async () => {
		await setParams({ action: null, resource: null });

		setKey(null);
		form.reset();
	};

	useEffect(() => {
		if (device) {
			form.setFieldValue("name", device.name || "My Device");
			form.setFieldValue("id", device.id || "My Device");
			form.setFieldValue("bluetoothName", device.name || "My Device");
		}
	}, [device]);

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
						{key ? (
							<div className="grid gap-4">
								{/* <CodeBlock
                  lang="bash"
                  isCopyable
                  textToCopy={key}
                  children={key}
                  className="rounded-lg"
                  title="API Key"
                /> */}

								<Alert.Root $variant="light" $status="information" $size="xs">
									<Alert.Icon as={Alert01SolidIcon} />
									<p>
										Your access token has been generated.{" "}
										<strong>
											Please copy it now and store it in a safe location
										</strong>
										. For security reasons, you will not be able to view this
										token again after leaving this page.
									</p>
								</Alert.Root>
							</div>
						) : (
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
									{/* Hidden input to include plan in form data for validation and submission */}
									{/* <input type="hidden" id="plan" name="plan" value={userPlan} /> */}
									{/* <Skeleton className="h-full w-full rounded-10" /> */}

									{/* Start Scanning */}
									{device ? null : (
										<Button
											$type="neutral"
											className="w-full"
											disabled={isConnecting}
											onClick={connect}
										>
											{isConnecting ? "Connecting..." : "Start Scanning"}
										</Button>
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
						)}
					</Modal.Body>

					<Modal.Footer>
						{!key && (
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
						)}

						{key ? (
							<Modal.Close asChild>
								<Button
									$size="sm"
									className="w-full"
									$type="neutral"
									onClick={handleClose}
								>
									Yes, I saved it
								</Button>
							</Modal.Close>
						) : (
							<form.SubmitButton
								$size="sm"
								className="w-full"
								disabled={form.state.isSubmitting}
								form="create-api-key-form"
								type="submit"
							>
								{form.state.isSubmitting ? "Creating..." : "Create"}
							</form.SubmitButton>
						)}
					</Modal.Footer>
				</Modal.Content>
			</form.AppForm>
		</Modal.Root>
	);
}
