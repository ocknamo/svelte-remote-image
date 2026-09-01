/**
 * `placeholder` values are written into an inline `style` attribute, so a value
 * coming from an untrusted source (a CMS, an API, a user profile) must not be
 * able to append extra CSS declarations to the element.
 *
 * Both helpers return `undefined` for anything they cannot verify, and the
 * caller then omits the declaration entirely.
 */

const hexColorPattern = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i

// Named colors, `transparent`, `currentColor`.
const keywordColorPattern = /^[a-z][a-z0-9-]*$/i

// Function notation: `rgb()`, `hsl()`, `oklch()`, `color-mix()`, `var()`, ...
// The argument list only allows characters that cannot end the declaration, so
// the function name itself does not need to be enumerated.
const colorFunctionPattern = /^[a-z][a-z0-9-]*\([0-9a-z_.,%\s/+*()#-]*\)$/i

// These would let a color value pull in a remote resource, and `/*` opens a
// comment that could hide the rest of the declaration.
const forbiddenFunctionPattern =
	/(?:^|[^a-z0-9_-])(?:url|image|image-set|cross-fade|element|paint)\s*\(/i
const commentPattern = /\/\*/

const maxColorLength = 256

/**
 * Parentheses must nest properly and only close at the very end, so a value
 * cannot continue past the function it opened with.
 */
const hasBalancedParentheses = (value: string): boolean => {
	let depth = 0

	for (let i = 0; i < value.length; i++) {
		const char = value[i]

		if (char === '(') {
			depth++
		} else if (char === ')') {
			depth--

			if (depth < 0) {
				return false
			}

			if (depth === 0 && i !== value.length - 1) {
				return false
			}
		}
	}

	return depth === 0
}

/**
 * Accepts a CSS color literal: hex, a keyword, or any color function such as
 * `rgb()`, `oklch()`, `color-mix()` and `var()`. Anything containing characters
 * that could end the declaration (`;`, `}`, quotes, `!important`) is rejected.
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

	if (forbiddenFunctionPattern.test(value) || commentPattern.test(value)) {
		return undefined
	}

	if (hexColorPattern.test(value) || keywordColorPattern.test(value)) {
		return value
	}

	return colorFunctionPattern.test(value) && hasBalancedParentheses(value)
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
