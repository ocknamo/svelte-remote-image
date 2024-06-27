<script lang="ts">
import type { ImageSrc } from '$lib/components/image.type.js'
import { Image } from '$lib/index.js'

const optimazerPrefix = 'https://nostr-image-optimizer.ocknamo.com/image/'
const originalImageUrl =
	'https://ocknamo.com/static/b84d6366deec053ff3fa77df01a54464/dccd3/cat.webp'

const src: ImageSrc = {
	w: 800,
	img: `${optimazerPrefix}width=1600,quality=70,format=webp/${originalImageUrl}`,
	webp: [
		{
			src: `${optimazerPrefix}width=1600,quality=50,format=webp/${originalImageUrl}`,
			w: 1600,
		},
		{
			src: `${optimazerPrefix}width=800,quality=50,format=webp/${originalImageUrl}`,
			w: 800,
		},
	],
	jpeg: [
		{
			src: `${optimazerPrefix}width=1600,quality=50,format=jpeg/${originalImageUrl}`,
			w: 1600,
		},
		{
			src: `${optimazerPrefix}width=800,quality=50,format=jpeg/${originalImageUrl}`,
			w: 800,
		},
	],
	failback: originalImageUrl,
	alt: 'blog top',
	placeholder: { dataUri: '', color: '#c5c5c5' },
	blur: true,
}
</script>

<h1>Welcome to Svelte Remote Image</h1>
<p>Display optimized images using CDN or other means.</p>

<Image {src} style='max-width: 100%;'/>

<a href="https://github.com/ocknamo/svelte-remote-image" target="_blank" rel="noopener noreferrer">github</a>
