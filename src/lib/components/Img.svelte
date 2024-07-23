<script lang="ts">
import { browser } from '$app/environment'
import type { ImgSrc } from './type.js'
import { afterUpdate } from 'svelte'

export let src: ImgSrc
// biome-ignore lint/suspicious/noImplicitAnyLet: This is component arg.
export let style
export const alt: string = ''
export const title: string = ''

const imgId = `svelte-remote-image-${alt.replaceAll(' ', '-')}-${Math.round(Math.random() * 10000000)}`
const getImgElement = () =>
	browser ? (document.getElementById(imgId) as HTMLImageElement | null) : null

afterUpdate(async () => {
	const img = getImgElement()

	if (!img) {
		return
	}

	// Image load success check.
	if (img.naturalWidth !== 0 && img.naturalHeight !== 0) {
		img.style.visibility = 'visible'
	} else {
		// Failed
		handleImgError()
	}
})

const handleImgError = (e?: Event) => {
	if (e && e.type !== 'error') {
		return
	}

	if (!src.fallback) {
		return
	}

	const img = getImgElement()

	if (!img) {
		return
	}

	img.style.visibility = 'hidden'

	let fallbackUrl: string | undefined = undefined

	const index = src.fallback.findIndex(
		(url) => new URL(url).toString() === new URL(img.src).toString(),
	)
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
		srcsets: [],
	}
}

const handleLoaded = (e: Event) => {
	const img = e.currentTarget as HTMLImageElement
	img.style.visibility = 'visible'
}
</script>

	<img
		id={imgId}
		width={src.w}
		height={src.h}
		{style}
		src={src.img}
		srcset={src.srcsets ? src.srcsets.map((s) => `${s.src} ${s.w}w`).join(', ') : ''}
		alt={alt}
		title={title}
		on:error={handleImgError}
		on:load={handleLoaded}
		loading="lazy"
	/>

<style>
	img {
		visibility: hidden;
	}
</style>