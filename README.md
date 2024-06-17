# svelte-remote-image

Display optimized images using CDN or other means.

## How to use

```
<script lang="ts">
  import type { ImageSrc } from "svelte-remote-image";
  import { Image } from "svelte-remote-image";

  // CDN URL
	const optimazerPrefix = 'https://nostr-image-optimizer.ocknamo.com/image/';
  const originalImageUrl = 'https://ocknamo.com/static/b84d6366deec053ff3fa77df01a54464/dccd3/cat.webp'

	let src: ImageSrc = {
		w: 800,
		img: `${optimazerPrefix}width=1600,quality=70,format=webp/${originalImageUrl}`,
		webp: [
			{ src: `${optimazerPrefix}width=1600,quality=50,format=webp/${originalImageUrl}`, w: 1600 },
			{ src: `${optimazerPrefix}width=800,quality=50,format=webp/${originalImageUrl}`, w: 800 }
		],
		jpeg: [
			{ src: `${optimazerPrefix}width=1600,quality=50,format=jpeg/${originalImageUrl}`, w: 1600 },
			{ src: `${optimazerPrefix}width=800,quality=50,format=jpeg/${originalImageUrl}`, w: 800 }
		],
		failback: originalImageUrl,
		alt: 'blog top',
		placeholder: { dataUri: '', color: '#c5c5c5' },
		blur: true
	};
</script>

<h1>Welcome to Svelte Remote Image</h1>
<p>Display optimized images using CDN or other means.</p>

<Image {src} />
```

The image component renders into:

```
<div class="picture-wrapper s-wHckl4XSACcy" style="background-color: #c5c5c5">
  <picture class="s-wHckl4XSACcy">
    <source
      srcset="https://nostr-image-optimizer.ocknamo.com/image/width=1600,quality=50,format=webp/https://ocknamo.com/static/b84d6366deec053ff3fa77df01a54464/dccd3/cat.webp 1600w, https://nostr-image-optimizer.ocknamo.com/image/width=800,quality=50,format=webp/https://ocknamo.com/static/b84d6366deec053ff3fa77df01a54464/dccd3/cat.webp 800w"
      type="image/webp" class="s-wHckl4XSACcy">
    <source
      srcset="https://nostr-image-optimizer.ocknamo.com/image/width=1600,quality=50,format=jpeg/https://ocknamo.com/static/b84d6366deec053ff3fa77df01a54464/dccd3/cat.webp 1600w, https://nostr-image-optimizer.ocknamo.com/image/width=800,quality=50,format=jpeg/https://ocknamo.com/static/b84d6366deec053ff3fa77df01a54464/dccd3/cat.webp 800w"
      type="image/jpeg" class="s-wHckl4XSACcy"> <img width="800" style="" class="image-blur-loading s-wHckl4XSACcy"
      src="https://nostr-image-optimizer.ocknamo.com/image/width=1600,quality=70,format=webp/https://ocknamo.com/static/b84d6366deec053ff3fa77df01a54464/dccd3/cat.webp"
      alt="blog top" loading="lazy">
  </picture>
</div>

<!-- css -->
.picture-wrapper.s-wHckl4XSACcy {
  width: fit-content;
  height: fit-content;
}
```


Inspired by [svelte-img](https://github.com/zerodevx/svelte-img?tab=readme-ov-file#remote-images-from-an-api).

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```
