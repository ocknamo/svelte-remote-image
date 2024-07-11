<script lang="ts">
import { browser } from '$app/environment'
import type { ImageSrc } from './image.type.js'
import { afterUpdate } from 'svelte'

export let src: ImageSrc
export let style = ''
export const alt: string = ''
export const title: string = ''

const imgId = `svelte-remote-image-${alt.replaceAll(' ', '-')}-${Math.round(Math.random() * 10000000)}`
const getImgElement = () =>
	browser ? (document.getElementById(imgId) as HTMLImageElement | null) : null

let loadStatus: 'loading' | 'loaded' = 'loading'
$: {
	loadStatus = 'loading'

	if (src.placeholder) {
		if (src.placeholder.dataUri) {
			style = `${style} background: url(${src.placeholder.dataUri}) no-repeat center/cover;`
		}
		if (src.placeholder.color) {
			style = `${style} background-color: ${src.placeholder.color};`
		}
	}

	const img = getImgElement()

	if (img) {
		img.style.visibility = 'hidden'
	}
}

afterUpdate(async () => {
	const img = getImgElement()

	if (!img || !img.complete) {
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

const handleImgError = (e?: Event) => {
	if (e && e.type !== 'error') {
		return
	}

	if (!src.failback) {
		return
	}

	const img = getImgElement()

	if (!img) {
		return
	}

	img.style.visibility = 'hidden'

	let failbackUrl: string | undefined = undefined

	const index = src.failback.findIndex(
		(url) => new URL(url).toString() === new URL(img.src).toString(),
	)
	if (index === -1) {
		failbackUrl = src.failback[0]
	} else {
		failbackUrl = src.failback[index + 1]
	}

	if (!failbackUrl) {
		return
	}

	// failback
	img.src = failbackUrl
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
		{style}
		class={src.blur ? `image-blur-${loadStatus}` : ''}
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
