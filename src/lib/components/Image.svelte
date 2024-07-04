<script lang="ts">
import type { ImageSrc } from './image.type.js'

export let src: ImageSrc
export let style = ''

let loadStatus: 'loading' | 'loaded' = 'loading'

if (src.placeholder) {
	if (src.placeholder.dataUri) {
		style = `${style} background: url(${src.placeholder.dataUri}) no-repeat center/cover;`
	}
	if (src.placeholder.color) {
		style = `${style} background-color: ${src.placeholder.color};`
	}
}

const handleImgError = (e: Event) => {
	if (e.type !== 'error') {
		return
	}

	const img = e.currentTarget as HTMLImageElement
	img.style.display = 'none'

	// failback
	src = {
		...src,
		img: src.failback,
		webp: [],
		jpeg: [],
		png: [],
		placeholder: {
			color: src.placeholder?.color,
			dataUri: src.placeholder?.dataUri,
		},
		blur: src.blur,
	}
}

const handleLoaded = (e: Event) => {
	const img = e.currentTarget as HTMLImageElement
	img.style.display = 'inline'
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
		width={src.w}
		height={src.h}
		{style}
		class={src.blur ? `image-blur-${loadStatus}` : ''}
		src={src.img}
		alt={src.alt}
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
