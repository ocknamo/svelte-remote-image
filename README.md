# svelte-remote-image

[demo](https://svelte-remote-image.pages.dev/)

Display optimized, responsive and progressive images for Svelte.
With remote image URL of CDN or other means.

- Fade-in and blur on image reveal.
- An image URL can be set to fallback if an image cannot be retrieved from the source URL due to an error.
- A pre-rendered low-quality dataURI can be set as a placeholder.


## Install

Install the package.

```
$ npm i svelte-remote-image
```

And import components and types. 

```
	import { Img, Picture, type ImgSrc, type PictureSrc } from "svelte-remote-image";
```

## How to use

Sample code.

### Img

```
<script lang="ts">
	import { Image, type ImageSrc } from "svelte-remote-image";

  // CDN URL
  const optimazerPrefix = 'https://nostr-image-optimizer.ocknamo.com/image/';
  const originalImageUrl = 'https://ocknamo.com/static/b84d6366deec053ff3fa77df01a54464/dccd3/cat.webp'

const imgSrc: ImgSrc = {
	w: 800,
	img: `https://ocknamo.com/cat.jpg`,
	srssets: [
		{
			src: `https://ocknamo.com/cat_1600.jpg`,
			w: 1600,
		},
		{
			src: `https://ocknamo.com/cat_800.jpg`,
			w: 800,
		},
	],
	fallback: ['https://ocknamo.com/cat_fallback.jpg'],
}
</script>

<Img src={imgSrc} style='max-width: 400px; max-width: 80%;' />
```

The image component renders into:

```
<img id="svelte-remote-image--6188058" width="800" style="max-width: 80%; visibility: hidden;"
	src="https://ocknamo.com/cat_fallback.jpg" srcset="" alt="" title="" loading="lazy" class="s-6LbhuE7J5MgN">
```

Inspired by [svelte-img](https://github.com/zerodevx/svelte-img?tab=readme-ov-file#remote-images-from-an-api).

### Picture

TBD

## Config

### ImageSrc

#### img: string

Image url.

#### w: number
  
Image width.

#### h?: number

Image height.

#### srssets: Srcset[]

Image sources for Img component.

#### webp?: Srcset[]

Image sources for webp.

#### jpeg?: Srcset[]

Image sources for jpeg.

#### png?: Srcset[]

Image sources for png.

#### fallback: string[]

Failback image urls.
The order is important because the images are tested in order from the top of the array.

#### alt: string

Alt text for image.

#### placeholder?: { dataUri?: string; color?: string }

Image data and background color for fastest display.

#### blur?: boolean
  
Whether to use the blur effect when displaying the image.
Default false.

#### Srcset

- src: string
  - Image URL.
- w: number
  - Width of actual image.

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
