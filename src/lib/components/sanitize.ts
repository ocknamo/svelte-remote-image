/**
 * `placeholder` values are written into an inline `style` attribute, so a value
 * coming from an untrusted source (a CMS, an API, a user profile) must not be
 * able to append extra CSS declarations to the element.
 *
 * Both helpers return `undefined` for anything they cannot verify, and the
 * caller then omits the declaration entirely.
 */

const cssColorPatterns = [
	// #rgb / #rgba / #rrggbb / #rrggbbaa
	/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,
	// Named colors, `transparent`, `currentColor`.
	/^[a-z]+$/i,
	// rgb() / rgba() / hsl() / hsla() with numeric arguments only.
	/^(?:rgb|rgba|hsl|hsla)\(\s*[0-9a-z.,%\s/+-]*\)$/i,
]

/**
 * Accepts a CSS color literal. Anything containing characters that could end
 * the declaration (`;`, `}`, quotes, extra parentheses) is rejected.
 */
export const sanitizeCssColor = (
	color: string | undefined,
): string | undefined => {
	if (!color) {
		return undefined
	}

	const value = color.trim()

	return cssColorPatterns.some((pattern) => pattern.test(value))
		? value
		: undefined
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
