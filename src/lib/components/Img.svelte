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

let visibilityStyle: 'invisible' | 'visible' = 'invisible'

let imgSrc: ImgSrc

$: {
	imgSrc = src
	visibilityStyle = 'invisible'
}

afterUpdate(async () => {
	const img = getImgElement()

	if (!img || !img.complete) {
		return
	}

	// Image load success check.
	if (img.naturalWidth !== 0 && img.naturalHeight !== 0) {
		visibilityStyle = 'visible'
	} else {
		// Failed
		handleImgError()
	}
})

const handleImgError = () => {
	if (!imgSrc.fallback) {
		return
	}
	visibilityStyle = 'invisible'

	const img = getImgElement()

	if (!img) {
		return
	}

	let fallbackUrl: string | undefined = undefined

	const index = imgSrc.fallback.findIndex(
		(url) => new URL(url).toString() === new URL(img.src).toString(),
	)
	if (index === -1) {
		fallbackUrl = imgSrc.fallback[0]
	} else {
		fallbackUrl = imgSrc.fallback[index + 1]
	}

	if (!fallbackUrl) {
		return
	}

	// fallback
	imgSrc = {
		...imgSrc,
		img: fallbackUrl,
		srcsets: undefined,
	}
}

const handleLoaded = () => {
	visibilityStyle = 'visible'
}
</script>

	<img
		id={imgId}
		width={imgSrc.w}
		height={imgSrc.h}
		{style}
		class={visibilityStyle}
		src={imgSrc.img}
		srcset={imgSrc.srcsets ? imgSrc.srcsets.map((s) => `${s.src} ${s.w}w`).join(', ') : ''}
		alt={alt}
		title={title}
		on:error={handleImgError}
		on:load={handleLoaded}
		loading="lazy"
	/>

<style>
	.visible {
		visibility: visible;
	}
	.invisible {
		visibility: hidden;
	}
</style>
