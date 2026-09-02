<script lang="ts">
import { BROWSER } from 'esm-env'
import { afterUpdate } from 'svelte'
import {
	sanitizeCssColor,
	sanitizeImageDataUri,
	toAbsoluteUrl,
} from './sanitize.js'
import type { PictureSrc } from './type.js'

export let src: PictureSrc
export let alt = ''
export let title = ''

export let style = ''
let className = ''

export { className as class }

const imgId = `svelte-remote-image-${alt.replaceAll(' ', '-')}-${Math.round(Math.random() * 10000000)}`
const getImgElement = () =>
	BROWSER ? (document.getElementById(imgId) as HTMLImageElement | null) : null

const buildPlaceholderStyle = (placeholder: PictureSrc['placeholder']) => {
	if (!placeholder) {
		return ''
	}

	let result = ''

	// Both values are rejected unless they are a plain CSS color / image data
	// URI, so a value from an untrusted source cannot append CSS declarations.
	const dataUri = sanitizeImageDataUri(placeholder.dataUri)
	if (dataUri) {
		result = `${result} background: url("${dataUri}") no-repeat center/cover;`
	}

	const color = sanitizeCssColor(placeholder.color)
	if (color) {
		result = `${result} background-color: ${color};`
	}

	return result
}

let loadStatus: 'loading' | 'loaded' = 'loading'

// The placeholder is combined with the caller's `style` instead of being
// appended to it, which used to grow the prop on every `src` change.
$: placeholderStyle = buildPlaceholderStyle(src.placeholder)
$: computedStyle = `${style}${placeholderStyle}`

$: if (src) {
	loadStatus = 'loading'

	const img = getImgElement()

	if (img) {
		img.style.visibility = 'hidden'
	}
}

afterUpdate(async () => {
	const img = getImgElement()

	if (!img?.complete) {
		return
	}

	// Image load success check.
	if (img.naturalWidth !== 0 && img.naturalHeight !== 0) {
		img.style.visibility = 'visible'
		loadStatus = 'loaded'
	} else {
		// Failed
		handleImgError()
	}
})

const handleImgError = () => {
	if (!src.fallback) {
		return
	}

	const img = getImgElement()

	if (!img) {
		return
	}

	img.style.visibility = 'hidden'

	let fallbackUrl: string | undefined

	const currentUrl = toAbsoluteUrl(img.src)
	const index = src.fallback.findIndex((url) => {
		const candidate = toAbsoluteUrl(url, img.baseURI)

		return candidate !== undefined && candidate === currentUrl
	})
	if (index === -1) {
		fallbackUrl = src.fallback[0]
	} else {
		fallbackUrl = src.fallback[index + 1]
	}

	if (!fallbackUrl) {
		return
	}

	// fallback
	src = {
		...src,
		img: fallbackUrl,
		webp: [],
		jpeg: [],
		png: [],
		placeholder: {
			color: src.placeholder?.color,
			dataUri: src.placeholder?.dataUri,
		},
	}
}

const handleLoaded = (e: Event) => {
	const img = e.currentTarget as HTMLImageElement
	img.style.visibility = 'visible'
	loadStatus = 'loaded'
}
</script>

<picture>
	{#if src.webp}
		<source srcset={src.webp.map((s) => `${s.src} ${s.w}w`).join(', ')} type="image/webp" />
	{/if}
	{#if src.jpeg}
		<source srcset={src.jpeg.map((s) => `${s.src} ${s.w}w`).join(', ')} type="image/jpeg" />
	{/if}
	{#if src.png}
		<source srcset={src.png.map((s) => `${s.src} ${s.w}w`).join(', ')} type="image/png" />
	{/if}
	<img
		id={imgId}
		width={src.w}
		height={src.h}
		style={computedStyle}
		class={src.blur ? `image-blur-${loadStatus} ${className}` : className}
		src={src.img}
		alt={alt}
		title={title}
		on:error={handleImgError}
		on:load={handleLoaded}
		loading="lazy"
	/>
</picture>

<style>
	.image-blur-loading {
		animation:
			0.5s linear 0s normal waiting,
			0.4s ease-in 0.5s normal show;
	}

	.image-blur-loaded {
		filter: blur(0px);
		opacity: 1;
	}

	@keyframes waiting {
		from {
			opacity: 0;
		}
		to {
			opacity: 0;
		}
	}

	@keyframes show {
		from {
			filter: blur(10px);
			opacity: 0.5;
		}
		to {
			filter: blur(5px);
			opacity: 1;
		}
	}

</style>
