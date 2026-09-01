import { describe, expect, it } from 'vitest'
import {
	sanitizeCssColor,
	sanitizeImageDataUri,
	toAbsoluteUrl,
} from './sanitize.js'

describe('sanitizeCssColor', () => {
	it('accepts color literals', () => {
		expect(sanitizeCssColor('#c5c5c5')).toBe('#c5c5c5')
		expect(sanitizeCssColor('#fff')).toBe('#fff')
		expect(sanitizeCssColor('#ffffff80')).toBe('#ffffff80')
		expect(sanitizeCssColor('red')).toBe('red')
		expect(sanitizeCssColor('transparent')).toBe('transparent')
		expect(sanitizeCssColor('currentColor')).toBe('currentColor')
		expect(sanitizeCssColor(' rgba(0, 0, 0, 0.5) ')).toBe('rgba(0, 0, 0, 0.5)')
		expect(sanitizeCssColor('rgb(0 0 0 / 50%)')).toBe('rgb(0 0 0 / 50%)')
		expect(sanitizeCssColor('hsl(120 50% 40%)')).toBe('hsl(120 50% 40%)')
	})

	it('accepts modern color functions and custom properties', () => {
		expect(sanitizeCssColor('oklch(70% 0.1 200)')).toBe('oklch(70% 0.1 200)')
		expect(sanitizeCssColor('lab(50% 40 59.5)')).toBe('lab(50% 40 59.5)')
		expect(sanitizeCssColor('hwb(194 0% 0%)')).toBe('hwb(194 0% 0%)')
		expect(sanitizeCssColor('color(display-p3 1 0.5 0)')).toBe(
			'color(display-p3 1 0.5 0)',
		)
		expect(sanitizeCssColor('var(--placeholder-color)')).toBe(
			'var(--placeholder-color)',
		)
		expect(sanitizeCssColor('var(--placeholder-color, #c5c5c5)')).toBe(
			'var(--placeholder-color, #c5c5c5)',
		)
		expect(
			sanitizeCssColor('color-mix(in srgb, red 30%, oklch(70% 0.1 200))'),
		).toBe('color-mix(in srgb, red 30%, oklch(70% 0.1 200))')
	})

	it('rejects values that would inject extra declarations', () => {
		expect(
			sanitizeCssColor(
				'red; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999',
			),
		).toBeUndefined()
		expect(sanitizeCssColor('red" onmouseover="alert(1)')).toBeUndefined()
		expect(sanitizeCssColor('red !important')).toBeUndefined()
		expect(sanitizeCssColor('rgb(0,0,0);background:url(x)')).toBeUndefined()
		expect(sanitizeCssColor('rgb(0,0,0)/*')).toBeUndefined()
		expect(sanitizeCssColor('}body{background:red')).toBeUndefined()
	})

	it('rejects values that would fetch a remote resource', () => {
		expect(sanitizeCssColor('url(https://example.com/track)')).toBeUndefined()
		expect(
			sanitizeCssColor('var(--x, url(https://example.com/track))'),
		).toBeUndefined()
		expect(
			sanitizeCssColor('image-set(https://example.com/a.png)'),
		).toBeUndefined()
	})

	it('rejects malformed values', () => {
		expect(sanitizeCssColor('rgb(0,0,0) rgb(0,0,0)')).toBeUndefined()
		expect(sanitizeCssColor('rgb(0,0,0')).toBeUndefined()
		expect(sanitizeCssColor('rgb(0,0,0))')).toBeUndefined()
		expect(sanitizeCssColor(`var(--${'a'.repeat(300)})`)).toBeUndefined()
		expect(sanitizeCssColor('')).toBeUndefined()
		expect(sanitizeCssColor(undefined)).toBeUndefined()
	})
})

describe('sanitizeImageDataUri', () => {
	it('accepts image data URIs', () => {
		const png = 'data:image/png;base64,iVBORw0KGgo='
		expect(sanitizeImageDataUri(png)).toBe(png)
		expect(sanitizeImageDataUri('data:image/svg+xml,%3Csvg%2F%3E')).toBe(
			'data:image/svg+xml,%3Csvg%2F%3E',
		)
	})

	it('rejects anything that could escape url("…")', () => {
		expect(
			sanitizeImageDataUri('data:image/png;base64,a") ; background: url("x'),
		).toBeUndefined()
		expect(sanitizeImageDataUri('data:text/html,<script>')).toBeUndefined()
		expect(sanitizeImageDataUri('javascript:alert(1)')).toBeUndefined()
		expect(sanitizeImageDataUri('https://example.com/a.png')).toBeUndefined()
		expect(sanitizeImageDataUri('')).toBeUndefined()
		expect(sanitizeImageDataUri(undefined)).toBeUndefined()
	})
})

describe('toAbsoluteUrl', () => {
	it('resolves relative URLs against the base', () => {
		expect(toAbsoluteUrl('/cat.png', 'https://example.com/a/b')).toBe(
			'https://example.com/cat.png',
		)
		expect(toAbsoluteUrl('https://example.com/cat.png')).toBe(
			'https://example.com/cat.png',
		)
	})

	it('returns undefined instead of throwing', () => {
		expect(toAbsoluteUrl('/cat.png')).toBeUndefined()
		expect(toAbsoluteUrl('not a url')).toBeUndefined()
	})
})
