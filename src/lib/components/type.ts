export interface Srcset {
	src: string
	w: number
}

export interface PictureSrc {
	img: string
	w?: number
	h?: number
	webp?: Srcset[]
	jpeg?: Srcset[]
	png?: Srcset[]
	fallback?: string[]
	placeholder?: {
		dataUri?: string
		color?: string
	}
	blur?: boolean
}

export interface ImgSrc {
	img: string
	srcsets?: Srcset[]
	w?: number
	h?: number
	fallback?: string[]
}
