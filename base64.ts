/**
 * Converts a string to base64.
 *
 * @param s The string to convert.
 * @returns The base64-encoded string.
 */
export function base64encode(s: string): string {
	if (btoa) {
		// if the browser supports
		return btoa(s);
	}
	// use node Buffer
	return Buffer.from(s, 'binary').toString('base64');
}

/**
 * Decodes a base64-encoded string.
 *
 * @param s The base64-encoded string to decode.
 * @returns The decoded string.
 */
export function base64decode(s: string): string {
	if (atob) {
		// if the browser supports
		return atob(s);
	}
	// use node Buffer
	return Buffer.from(s, 'base64').toString('binary')
}
