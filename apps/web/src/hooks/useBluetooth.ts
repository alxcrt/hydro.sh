import { useCallback, useEffect, useRef, useState } from "react";

interface BluetoothServiceConfig {
	serviceUUID: string;
	characteristicUUID: string;
}

interface BluetoothHookReturn {
	device: BluetoothDevice | null;
	isConnected: boolean;
	isConnecting: boolean;
	error: string | null;

	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
	clearError: () => void;

	writeCharacteristic: (
		serviceConfig: BluetoothServiceConfig,
		value: BufferSource,
	) => Promise<void>;
	readCharacteristic: (
		serviceConfig: BluetoothServiceConfig,
	) => Promise<DataView>;
	subscribeToNotifications: (
		serviceConfig: BluetoothServiceConfig,
		callback: (value: DataView) => void,
	) => Promise<() => void>;
}

interface BluetoothHookConfig {
	autoConnect?: boolean;
	reconnectAttempts?: number;
	reconnectDelay?: number;
	services?: BluetoothServiceUUID[];
}

const DEFAULT_CONFIG: BluetoothHookConfig = {
	autoConnect: true,
	reconnectAttempts: 3,
	reconnectDelay: 2_000,
	services: [],
};

export const useBluetooth = (
	config: BluetoothHookConfig = {},
): BluetoothHookReturn => {
	const finalConfig = { ...DEFAULT_CONFIG, ...config };

	// Add proper type for config to match return type's optional properties
	// const mergedConfig: Required<BluetoothHookConfig> = finalConfig;

	const [device, setDevice] = useState<BluetoothDevice | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const reconnectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const reconnectionAttemptsRef = useRef(0);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const checkBluetoothSupport = useCallback(() => {
		if (!navigator.bluetooth) {
			throw new Error("Web Bluetooth API is not available in your browser");
		}
		if (!navigator.bluetooth.requestDevice) {
			throw new Error("Web Bluetooth device request is not available");
		}
	}, []);

	const connect = useCallback(async () => {
		checkBluetoothSupport();

		try {
			setIsConnecting(true);
			setError(null);

			checkBluetoothSupport();

			const device = await navigator.bluetooth.requestDevice({
				acceptAllDevices: true,

				// Filters are not allowed when acceptAllDevices is true
				// filters: [{ services: config.services, namePrefix: "h2o" }],
				optionalServices: finalConfig.services || [],
			});

			// Connect to the GATT server of the device
			// GATT (Generic Attribute Profile) defines how Bluetooth devices transfer data
			// This initiates the connection to the device's GATT server which provides
			// access to services and characteristics for data exchange
			const server = await device.gatt?.connect();

			if (!server) {
				throw new Error("Failed to connect to the device");
			}

			setDevice(device);
			setIsConnected(true);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown connection error";
			setError(errorMessage);
		} finally {
			// Always stop the connecting state
			setIsConnecting(false);
		}
	}, [finalConfig.services, checkBluetoothSupport]);

	const attemptReconnection = useCallback(async () => {
		if (!finalConfig.autoConnect || !device) return;

		if (
			reconnectionAttemptsRef.current >= (finalConfig?.reconnectAttempts ?? 0)
		) {
			setError("Failed to reconnect after multiple attempts");
			return;
		}

		reconnectionAttemptsRef.current++;
		console.log(
			`Reconnection attempt ${reconnectionAttemptsRef.current}/${finalConfig.reconnectAttempts}`,
		);
		reconnectionTimeoutRef.current = setTimeout(async () => {
			try {
				if (!device.gatt?.connected) {
					await device.gatt?.connect();
					console.log("Reconnected to device");
					setIsConnected(true);
					setError(null);
					reconnectionAttemptsRef.current = 0;
				}
			} catch (err) {
				console.warn(
					`Reconnection attempt ${reconnectionAttemptsRef.current} failed:`,
					err,
				);

				// Call attemptReconnection only if the component is still mounted
				// This helps prevent memory leaks and errors with state updates
				attemptReconnection();
			}
		}, finalConfig.reconnectDelay);
	}, [
		finalConfig.autoConnect,
		device,
		finalConfig.reconnectDelay,
		finalConfig.reconnectAttempts,
	]);

	const handleDisconnection = useCallback(() => {
		console.log("Disconnected from device");
		setIsConnected(false);
		// Note: We will keep the device reference in the state for potential reconnection
		if (finalConfig.autoConnect) {
			attemptReconnection();
		}
	}, [finalConfig.autoConnect, attemptReconnection]);

	// Manually disconnect from the device
	const disconnect = useCallback(async () => {
		try {
			if (device?.gatt?.connected) {
				device.gatt?.disconnect();
				console.log("Manually disconnected from device");
			}

			setDevice(null);
			setIsConnected(false);
			setError(null);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown disconnection error";
			setError(errorMessage);
		}
	}, [device]);

	useEffect(() => {
		if (device) {
			// Add event listener to detect any disconnection events
			device.addEventListener("gattserverdisconnected", handleDisconnection);

			// Cleanup function that runs when component unmounts or device changes
			return () => {
				device.removeEventListener(
					"gattserverdisconnected",
					handleDisconnection,
				);
			};
		}
	}, [device, handleDisconnection]);

	const writeCharacteristic = useCallback(
		async (serviceConfig: BluetoothServiceConfig, value: BufferSource) => {
			if (!device?.gatt?.connected) {
				throw new Error("Device not connected");
			}

			const { serviceUUID, characteristicUUID } = serviceConfig;

			try {
				const service = await device.gatt.getPrimaryService(serviceUUID);
				const characteristic =
					await service.getCharacteristic(characteristicUUID);
				await characteristic.writeValue(value);
				console.log("Write successful");
			} catch (err) {
				const errorMessage = `Write failed: ${err instanceof Error ? err.message : "Unknown error"}`;
				setError(errorMessage);
				throw new Error(errorMessage);
			}
		},
		[device],
	);

	const readCharacteristic = useCallback(
		async (serviceConfig: BluetoothServiceConfig): Promise<DataView> => {
			if (!device?.gatt?.connected) {
				throw new Error("Device not connected");
			}

			const { serviceUUID, characteristicUUID } = serviceConfig;

			try {
				const service = await device.gatt.getPrimaryService(serviceUUID);
				const characteristic =
					await service.getCharacteristic(characteristicUUID);
				const value = await characteristic.readValue();
				console.log("Read successful");
				return value;
			} catch (err) {
				const errorMessage = `Read failed: ${err instanceof Error ? err.message : "Unknown error"}`;
				setError(errorMessage);
				throw new Error(errorMessage);
			}
		},
		[device],
	);

	const subscribeToNotifications = useCallback(
		async (
			serviceConfig: BluetoothServiceConfig,
			callback: (value: DataView) => void,
		): Promise<() => void> => {
			if (!device?.gatt?.connected) {
				throw new Error("Device not connected");
			}

			const { serviceUUID, characteristicUUID } = serviceConfig;

			try {
				const service = await device.gatt.getPrimaryService(serviceUUID);
				const characteristic =
					await service.getCharacteristic(characteristicUUID);

				const handleNotification = (event: Event) => {
					const target = event.target as BluetoothRemoteGATTCharacteristic;
					if (target.value) {
						callback(target.value);
					}
				};

				characteristic.addEventListener(
					"characteristicvaluechanged",
					handleNotification,
				);
				await characteristic.startNotifications();
				console.log("Subscription successful");

				// Return unsubscribe function
				return () => {
					characteristic.removeEventListener(
						"characteristicvaluechanged",
						handleNotification,
					);
					characteristic.stopNotifications().catch(console.error);
					console.log("Unsubscribed from notifications");
				};
			} catch (err) {
				const errorMessage = `Subscription failed: ${err instanceof Error ? err.message : "Unknown error"}`;
				setError(errorMessage);
				throw new Error(errorMessage);
			}
		},
		[device],
	);

	return {
		device,
		isConnected,
		isConnecting,
		error,
		connect,
		disconnect,
		clearError,
		writeCharacteristic,
		readCharacteristic,
		subscribeToNotifications,
	};
};
