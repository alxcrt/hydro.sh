import { z } from "zod";

export const CreateDeviceSchema = z.object({
	name: z
		.string({
			error: (issue) =>
				issue.input === undefined ? "Device name is required" : undefined,
		})
		.min(1, {
			message: "Device name is required",
		}),
	bluetoothName: z
		.string({
			error: (issue) =>
				issue.input === undefined ? "Bluetooth name is required" : undefined,
		})
		.min(1, {
			message: "Bluetooth name is required",
		}),
	deviceIdentifier: z
		.string({
			error: (issue) =>
				issue.input === undefined ? "Device identifier is required" : undefined,
		})
		.min(1, {
			message: "Device identifier is required",
		}),
});

export const UpdateDeviceSchema = z.object({
	id: z.string({
		error: (issue) =>
			issue.input === undefined ? "Device ID is required" : undefined,
	}),
	name: z.string().min(1).optional(),
	bluetoothName: z.string().min(1).optional(),
});

export const DeviceSchema = z.object({
	id: z.string(),
	name: z.string(),
	bluetoothName: z.string(),
	deviceIdentifier: z.string(),
	lastConnected: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	userId: z.string(),
});

export const DeleteDeviceSchema = z.object({
	id: z.string(),
});
