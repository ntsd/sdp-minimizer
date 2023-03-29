declare global {
	interface Window {
		Buffer: typeof Buffer;
	}
}

/**
 * Converts a string to base64.
 *
 * @param s The string to convert.
 * @returns The base64-encoded string.
 */
export function btoa(s: string): string {
	return Buffer.from(s, 'binary').toString('base64')
}

/**
 * Decodes a base64-encoded string.
 *
 * @param s The base64-encoded string to decode.
 * @returns The decoded string.
 */
export function atob(s: string): string {
	return Buffer.from(s, 'base64').toString('binary')
}
