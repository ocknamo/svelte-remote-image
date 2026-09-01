/**
 * `placeholder` values are written into an inline `style` attribute, so a value
 * coming from an untrusted source (a CMS, an API, a user profile) must not be
 * able to append extra CSS declarations to the element.
 *
 * Both helpers return `undefined` for a value they consider unsafe, and the
 * caller then omits the declaration entirely.
 */

const maxColorLength = 256

/**
 * The value ends up as `background-color: <value>;` inside a `style`
 * attribute, so only two things actually matter:
 *
 * - `;` (and `{}`) would end the declaration and let a new one follow, and an
 *   opening CSS comment could comment out what comes after it.
 * - The listed functions would make the value fetch a remote resource.
 *
 * Everything else is left to the browser: an invalid color is simply dropped,
 * and Svelte escapes the attribute, so quotes cannot break out into HTML.
 */
const unsafeColorPattern =
	/[;{}]|\/\*|(?:^|[^a-z0-9_-])(?:url|image|image-set|cross-fade|element|paint)\s*\(/i

/**
 * Accepts any CSS color the browser understands - hex, keywords, `rgb()`,
 * `oklch()`, `color-mix()`, `var()` - and rejects the constructs above.
 */
export const sanitizeCssColor = (
	color: string | undefined,
): string | undefined => {
	if (!color) {
		return undefined
	}

	const value = color.trim()

	if (value.length === 0 || value.length > maxColorLength) {
		return undefined
	}

	return unsafeColorPattern.test(value) ? undefined : value
}

/**
 * Accepts a `data:` URI holding an image. The payload is limited to base64 and
 * percent-encoded characters so that the value cannot break out of `url("…")`.
 */
const imageDataUriPattern =
	/^data:image\/[a-z0-9.+-]+(?:;charset=[a-z0-9-]+)?(?:;base64)?,[A-Za-z0-9+/=%._~-]*$/i

export const sanitizeImageDataUri = (
	dataUri: string | undefined,
): string | undefined => {
	if (!dataUri) {
		return undefined
	}

	const value = dataUri.trim()

	return imageDataUriPattern.test(value) ? value : undefined
}

/**
 * `new URL()` throws on relative URLs, which would otherwise abort the fallback
 * chain. Returns `undefined` instead so the caller can skip the comparison.
 */
export const toAbsoluteUrl = (
	url: string,
	base?: string,
): string | undefined => {
	try {
		return new URL(url, base).toString()
	} catch {
		return undefined
	}
}
