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
		expect(sanitizeCssColor(' rgba(0, 0, 0, 0.5) ')).toBe('rgba(0, 0, 0, 0.5)')
		expect(sanitizeCssColor('hsl(120 50% 40%)')).toBe('hsl(120 50% 40%)')
	})

	it('rejects values that would inject extra declarations', () => {
		expect(
			sanitizeCssColor(
				'red; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999',
			),
		).toBeUndefined()
		expect(sanitizeCssColor('red" onmouseover="alert(1)')).toBeUndefined()
		expect(sanitizeCssColor('url(https://example.com/track)')).toBeUndefined()
		expect(sanitizeCssColor('rgb(0,0,0);background:url(x)')).toBeUndefined()
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
