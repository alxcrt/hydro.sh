// def parseSip(self, data):
// """
// parses sips from data sent by water bottle.
// # diff-de5804e048e763f99ae84940f91d80e11b58f1b69da346d32a17abd6940e7db4R85
// code taken from https://github.com/choonkiatlee/wban-python/commit/3c644a32702f2a37e7a9c10f49bc5ebfcbf0a688
// """
// # Parsed from dataPointCharacteristicDidUpdate in RxBLEConnectCoordinator.java
// no_sips_left_on_device = data[0]
// b2 = data[1] & 255          # Likely some version of sip size as percentage of bottle fullness

// SipSize = (self.BOTTLE_SIZE * b2) / 100

// # This bit of list comprehension magic gets us [data[3], data[2]]
// total = int.from_bytes(data[3:1:-1], "little") & 65535

// secondsAgo = int.from_bytes(data[8:4:-1], "little") & -1

// # print("Sip Size: {0}, Total: {1}, Seconds Ago: {2}, Sips Left: {3}".format(
// #     SipSize, total, secondsAgo, no_sips_left_on_device))

// return SipSize, total, secondsAgo, no_sips_left_on_device

// in typescript

export function parseSip(data: DataView) {
	if (data.byteLength < 16) {
		throw new Error("Data must be at least 16 bytes long");
	}

	const BOTTLE_SIZE = 640;

	const noSipsLeftOnDevice = data.getUint8(0);
	const b2 = data.getUint8(1); // Likely some version of sip size as percentage of bottle fullness
	const sipSize = (BOTTLE_SIZE * b2) / 100;

	// Get total by combining bytes 2-3 in little endian order
	const total = data.getUint16(2, true); // true for little endian

	// Get seconds ago from bytes 4-8 in little endian order
	const secondsAgo = data.getInt32(4, true); // true for little endian

	// console.table({
	//   noSipsLeftOnDevice,
	//   sipSize,
	//   total,
	//   secondsAgo,
	// });

	return {
		noSipsLeftOnDevice,
		sipSize,
		total,
		secondsAgo,
	};
}

// static /* synthetic */ SingleSource lambda$startReadHistory$32(int i, int i2, RxBleConnection rxBleConnection) throws Exception {
//   byte[] bArr;
//   UUID fromString = UUID.fromString(BLEMessage.READY_FOR_HISTORY.associatedUuid);
//   if (i >= 30 || (i == 7 && i2 >= 24)) {
//       bArr = BLEMessage.READY_FOR_HISTORY_FAST.value;
//   } else {
//       bArr = BLEMessage.READY_FOR_HISTORY.value;
//   }
//   return rxBleConnection.writeCharacteristic(fromString, bArr);
// }

// read history

export async function readHistory(
	connectedDevice: BluetoothDevice,
	characteristic: BluetoothRemoteGATTCharacteristic,
) {
	console.log("Reading history");
	if (!connectedDevice) {
		throw new Error("No device connected");
	}
	// const service = await connectedDevice.gatt?.getPrimaryService(
	//   "45855422-6565-4cd7-a2a9-fe8af41b85e8".toLowerCase(),
	// );
	// const characteristic = await service?.getCharacteristic(
	//   "016e11b1-6c8a-4074-9e5a-076053f93784".toLowerCase(),
	// );

	// public static final BLEMessage READY_FOR_HISTORY_FAST = new BLEMessage(new byte[]{87}, HidrateBleCharactersticConstants.DATA_POINT);
	const value = new Uint8Array([0x57]);
	console.log("History request sent", value);
	await characteristic?.writeValueWithoutResponse(value);
}
