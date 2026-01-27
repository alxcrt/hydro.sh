import { useBluetooth } from "@/hooks/useBluetooth";
import {
	nordicCustomColorByteArray,
	parseSip,
	rgbTo16bit,
} from "@hydro.sh/common";
import { useCallback, useEffect, useMemo, useState } from "react";

const BATTERY = "00002a19-0000-1000-8000-00805f9b34fb";
const BOOTLOADER = "00060001-f8ce-11e4-abf4-0002a5d5c51b";
const CONFIG = "31FB5B6C-0166-4C97-BA1D-BF0A82FBBCB6";
const DATA_POINT = "016e11b1-6c8a-4074-9e5a-076053f93784";
const DEBUG = "e3578b0d-caa7-46d6-b7c2-7331c08de044";
const FIRMWARE_VERSION = "00002a26-0000-1000-8000-00805f9b34fb";
const H2O_TOTAL = "6ac24e8b-056c-4077-8221-8f816ade71e6";
const LED_CONTROL = "a1d9a5bf-f5d8-49f3-a440-e6bf27440cb0";
const NORDIC_CUSTOM_COLOR = "B810E826-CF05-4B46-A725-07BC0FA2E5D9";
const NORDIC_LED_CONTROL = "B810E826-CF05-4B46-A725-07BC0FA2E5D9";
const SET_POINT = "b44b03f0-b850-4090-86eb-72863fb3618d";

interface BottleData {
	batteryLevel: number | null;
	firmwareVersion: string | null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	sipData: any | null;
	isConnected: boolean;
	isConnecting: boolean;
	error: string | null;
}

// You can either get the data from the characteristic or subscribe to notifications
// If the device is connected, you can get the data from the characteristic
// If the device is not connected, you can subscribe to notifications
// If the device is connected, you can get the data from the characteristic

interface UseBottleProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onHandleSipData: (sipData: any) => void;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onHandleDebug?: (debugData: any) => void;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useBottle({ onHandleSipData, onHandleDebug }: UseBottleProps) {
	const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
	const [firmwareVersion, setFirmwareVersion] = useState<string | null>(null);

	const {
		device,
		isConnected,
		isConnecting,
		error,
		connect,
		disconnect,
		clearError,
		readCharacteristic,
		writeCharacteristic,
		subscribeToNotifications,
	} = useBluetooth({
		services: [
			// LED control service
			"4f817071-4180-434a-982b-422b4c9e6611".toLowerCase(),
			// Sip/data control service
			"45855422-6565-4cd7-a2a9-fe8af41b85e8".toLowerCase(),
			// Battery service
			"battery_service".toLowerCase(),
			// Device information service (for firmware)
			"0000180a-0000-1000-8000-00805f9b34fb".toLowerCase(),
			// Debug service
			"593f756e-fafc-49ba-8695-b39ca851b00b".toLowerCase(),
		],
	});

	const BLUETOOTH_CONSTANTS = useMemo(
		() => ({
			BATTERY: {
				serviceUUID: "battery_service".toLowerCase(),
				characteristicUUID: BATTERY.toLowerCase(),
			},
			FIRMWARE: {
				serviceUUID: "0000180a-0000-1000-8000-00805f9b34fb".toLowerCase(),
				characteristicUUID: FIRMWARE_VERSION.toLowerCase(),
			},
			DEBUG: {
				serviceUUID: "593f756e-fafc-49ba-8695-b39ca851b00b".toLowerCase(),
				characteristicUUID:
					"e3578b0d-caa7-46d6-b7c2-7331c08de044".toLowerCase(),
			},
			SIP_DATA: {
				serviceUUID: "45855422-6565-4cd7-a2a9-fe8af41b85e8".toLowerCase(),
				characteristicUUID:
					"016e11b1-6c8a-4074-9e5a-076053f93784".toLowerCase(),
			},
			LED: {
				serviceUUID: "4f817071-4180-434a-982b-422b4c9e6611".toLowerCase(),
				characteristicUUID:
					"B810E826-CF05-4B46-A725-07BC0FA2E5D9".toLowerCase(),
			},
		}),
		[],
	);

	const getBatteryLevel = useCallback(async () => {
		if (!isConnected) {
			throw new Error("Device not connected");
		}

		try {
			const batteryValue = await readCharacteristic(
				BLUETOOTH_CONSTANTS.BATTERY,
			);
			if (batteryValue) {
				const level = batteryValue.getUint8(0);
				setBatteryLevel(level);
				return level;
			}
			return null;
		} catch (error) {
			console.error("Error reading battery level:", error);
			throw error;
		}
	}, [isConnected, readCharacteristic, BLUETOOTH_CONSTANTS.BATTERY]);

	const getSipData = useCallback(async () => {
		if (!isConnected) {
			throw new Error("Device not connected");
		}

		try {
			const value = await readCharacteristic(BLUETOOTH_CONSTANTS.SIP_DATA);
			if (value) {
				const sip = parseSip(value);

				if (sip.sipSize > 0) {
					onHandleSipData({
						timestamp: new Date(Date.now() - sip.secondsAgo * 1000),
						sipSize: sip.sipSize,
						noSipsLeftOnDevice: sip.noSipsLeftOnDevice,
						total: sip.total,
						secondsAgo: sip.secondsAgo,
					});
					// setSipData({
					//   timestamp: new Date(Date.now() - sip.secondsAgo * 1000),
					//   sipSize: sip.sipSize,
					//   noSipsLeftOnDevice: sip.noSipsLeftOnDevice,
					//   total: sip.total,
					//   secondsAgo: sip.secondsAgo,
					// });
				} else if (sip.noSipsLeftOnDevice > 0) {
					// Request history data from the device
					try {
						await writeCharacteristic(
							BLUETOOTH_CONSTANTS.SIP_DATA,
							new Uint8Array([0x57]),
						);
						console.log("Requested history data from device");
					} catch (error) {
						console.error("Error requesting history data:", error);
					}
				}
			}
			return null;
		} catch (error) {
			console.error("Error reading sip data:", error);
			throw error;
		}
	}, [
		isConnected,
		readCharacteristic,
		writeCharacteristic,
		onHandleSipData,
		BLUETOOTH_CONSTANTS.SIP_DATA,
	]);

	const getDebugData = useCallback(async () => {
		if (!isConnected) {
			throw new Error("Device not connected");
		}

		try {
			const debugData = await readCharacteristic(BLUETOOTH_CONSTANTS.DEBUG);
			if (debugData && onHandleDebug) {
				onHandleDebug({
					timestamp: new Date(),
					data: Array.from(new Uint8Array(debugData.buffer)),
				});
				// setDebugData({
				//   timestamp: new Date(),
				//   data: Array.from(new Uint8Array(debugData.buffer)),
				// });
			}
		} catch (error) {
			console.error("Error reading debug data:", error);
			throw error;
		}
	}, [
		isConnected,
		readCharacteristic,
		onHandleDebug,
		BLUETOOTH_CONSTANTS.DEBUG,
	]);

	const getFirmwareVersion = useCallback(async () => {
		if (!isConnected) {
			throw new Error("Device not connected");
		}

		try {
			const firmwareValue = await readCharacteristic(
				BLUETOOTH_CONSTANTS.FIRMWARE,
			);
			if (firmwareValue) {
				const decoder = new TextDecoder("utf-8");
				const version = decoder.decode(firmwareValue);
				setFirmwareVersion(version);
				return version;
			}
			return null;
		} catch (error) {
			console.error("Error reading firmware version:", error);
			throw error;
		}
	}, [isConnected, readCharacteristic, BLUETOOTH_CONSTANTS.FIRMWARE]);

	const subscribeToBatteryUpdates = useCallback(async () => {
		if (!isConnected) return;

		try {
			await subscribeToNotifications(
				BLUETOOTH_CONSTANTS.BATTERY,
				(value: DataView) => {
					// const value = event.target.value;
					// if (value) {
					//   const level = value.getUint8(0);
					//   setBatteryLevel(level);
					// }
					if (value) {
						const level = value.getUint8(0);
						setBatteryLevel(level);
					}
				},
			);
		} catch (error) {
			console.error("Error subscribing to battery updates:", error);
		}
	}, [isConnected, subscribeToNotifications, BLUETOOTH_CONSTANTS.BATTERY]);

	const subscribeToSipData = useCallback(async () => {
		if (!isConnected) return;

		try {
			await subscribeToNotifications(
				BLUETOOTH_CONSTANTS.SIP_DATA,
				async (value: DataView) => {
					if (value) {
						const sip = parseSip(value);

						if (sip.sipSize > 0) {
							onHandleSipData({
								timestamp: new Date(Date.now() - sip.secondsAgo * 1000),
								sipSize: sip.sipSize,
								noSipsLeftOnDevice: sip.noSipsLeftOnDevice,
								total: sip.total,
								secondsAgo: sip.secondsAgo,
							});
							// setSipData({
							//   timestamp: new Date(Date.now() - sip.secondsAgo * 1000),
							//   sipSize: sip.sipSize,
							//   noSipsLeftOnDevice: sip.noSipsLeftOnDevice,
							//   total: sip.total,
							//   secondsAgo: sip.secondsAgo,
							// });
						} else if (sip.noSipsLeftOnDevice > 0) {
							// Request history data from the device
							try {
								await writeCharacteristic(
									BLUETOOTH_CONSTANTS.SIP_DATA,
									new Uint8Array([0x57]),
								);
								console.log("Requested history data from device");
							} catch (error) {
								console.error("Error requesting history data:", error);
							}
						}
					}
				},
			);
		} catch (error) {
			console.error("Error subscribing to sip data:", error);
		}
	}, [
		isConnected,
		subscribeToNotifications,
		writeCharacteristic,
		onHandleSipData,
		BLUETOOTH_CONSTANTS.SIP_DATA,
	]);

	const subscribeToDebugData = useCallback(async () => {
		if (!isConnected) return;

		try {
			await subscribeToNotifications(
				BLUETOOTH_CONSTANTS.DEBUG,
				(value: DataView) => {
					if (value && onHandleDebug) {
						// Process debug data based on your device's data format
						onHandleDebug({
							timestamp: new Date(),
							data: Array.from(new Uint8Array(value.buffer)),
						});
						console.log("Debug data:", {
							timestamp: new Date(),
							data: Array.from(new Uint8Array(value.buffer)),
						});
					}
				},
			);
		} catch (error) {
			console.error("Error subscribing to debug data:", error);
		}
	}, [
		isConnected,
		subscribeToNotifications,
		onHandleDebug,
		BLUETOOTH_CONSTANTS.DEBUG,
	]);

	const setLedColor = useCallback(
		async (color1: string, color2: string) => {
			if (!isConnected) {
				throw new Error("No device connected");
			}

			try {
				console.log("Setting LED color:", color1, color2);

				const r1 = Number.parseInt(color1.slice(1, 3), 16);
				const g1 = Number.parseInt(color1.slice(3, 5), 16);
				const b1 = Number.parseInt(color1.slice(5, 7), 16);

				const r2 = Number.parseInt(color2.slice(1, 3), 16);
				const g2 = Number.parseInt(color2.slice(3, 5), 16);
				const b2 = Number.parseInt(color2.slice(5, 7), 16);

				const colorBytes = nordicCustomColorByteArray(
					rgbTo16bit(r1, g1, b1),
					rgbTo16bit(r2, g2, b2),
				);

				// Set LED color
				await writeCharacteristic(BLUETOOTH_CONSTANTS.LED, colorBytes);

				// High glow b4
				await writeCharacteristic(
					{
						serviceUUID: "4f817071-4180-434a-982b-422b4c9e6611".toLowerCase(),
						characteristicUUID:
							"a1d9a5bf-f5d8-49f3-a440-e6bf27440cb0".toLowerCase(),
					},
					new Uint8Array([0xb4]),
				);
			} catch (error) {
				console.error("Error writing to LED:", error);
				throw error;
			}
		},
		[isConnected, writeCharacteristic, BLUETOOTH_CONSTANTS.LED],
	);

	// Initialize subscriptions when connected
	useEffect(() => {
		if (isConnected && device) {
			(async () => {
				try {
					await getBatteryLevel();
					await getFirmwareVersion();
					await getSipData();
					await getDebugData();
					await subscribeToBatteryUpdates();
					await subscribeToSipData();
					await subscribeToDebugData();
				} catch (error) {
					console.error("Error initializing bottle data:", error);
				}
			})();
		}
	}, [
		device,
		getBatteryLevel,
		getFirmwareVersion,
		subscribeToDebugData,
		subscribeToBatteryUpdates,
		isConnected,
		subscribeToSipData,
		getSipData,
		getDebugData,
	]);

	return {
		device,
		batteryLevel,
		firmwareVersion,
		// sipData,
		// debugData,
		isConnected,
		isConnecting,
		error,
		connect,
		disconnect,
		clearError,
		setLedColor,
	};
}
