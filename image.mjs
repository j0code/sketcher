import { e } from "./util.mjs"
import * as svg from "./svgelems.mjs"

export default class SvgImage {

	#width; #height;
	constructor(width = 50, height = 50, bgColor = "#ffffff") {
		this.#width  = width
		this.#height = height
		this.bgColor = bgColor
		this.canvas  = e("canvas")
		this.canvas.width  = this.#width
		this.canvas.height = this.#height
		this.scale   = 1
		this.offset  = [0, 0]
		this.svg = new svg.SVGRootElement()
	}

	draw() {

		const ctx = this.canvas.getContext("2d")
		ctx.fillStyle = this.bgColor
		ctx.fillRect(0, 0, this.width, this.height)

		this.svg.draw(ctx)

	}

	get width() {
		return this.#width
	}

	get height() {
		return this.#height
	}

	set width(w) {
		this.#width = w
		this.canvas.width = w
	}

	set height(h) {
		this.#height = h
		this.canvas.height = h
	}

	addElement(e) {
		if (e instanceof svg.SVGElement) {
			this.svg.children.push(e)
		}
	}

}
