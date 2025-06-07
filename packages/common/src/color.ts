export function nordicCustomColorByteArray(...colors: number[]): Uint8Array {
	// const color1Bytes = new Uint8Array(new Uint16Array([color1]).buffer);
	// const color2Bytes = new Uint8Array(new Uint16Array([color2]).buffer);
	// return new Uint8Array([...color1Bytes, ...color2Bytes]);
	const colorBytes: number[] = [];
	for (const color of colors) {
		const bytes = new Uint8Array(new Uint16Array([color]).buffer);
		colorBytes.push(...bytes);
	}
	return new Uint8Array(colorBytes);
}

export function rgbTo16bit(r: number, g: number, b: number): number {
	return ((r & 0xf8) << 8) | ((g & 0xfc) << 3) | (b >> 3);
}
