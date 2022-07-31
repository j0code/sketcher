import { e } from "./util.mjs"
import * as svg from "./svgelems.mjs"

export default class SvgImage {

	#width; #height; #scale
	constructor(width = 50, height = 50, bgColor = "#ffffff") {
		this.#width  = width
		this.#height = height
		this.bgColor = bgColor
		this.canvas  = e("canvas")
		this.canvas.width  = this.#width
		this.canvas.height = this.#height
		this.#scale  = 1
		this.offset  = [0, 0]
		this.svg = new svg.SVGRootElement()
	}

	draw() {

		const ctx = this.canvas.getContext("2d")
		ctx.fillStyle = this.bgColor
		ctx.fillRect(0, 0, this.#width * this.#scale, this.#height * this.#scale)

		this.svg.draw(ctx, this.#scale)

	}

	get width() {
		return this.#width
	}

	get height() {
		return this.#height
	}

	get scale() {
		return this.#scale
	}

	set width(w) {
		this.#width = w
		this.canvas.width = w * this.#scale
	}

	set height(h) {
		this.#height = h
		this.canvas.height = h * this.#scale
	}

	set scale(x) {
		this.#scale = x
		this.canvas.width  = this.#width  * this.#scale
		this.canvas.height = this.#height * this.#scale
		this.draw()
	}

	addElement(e) {
		if (e instanceof svg.SVGElement) {
			this.svg.children.push(e)
		}
		this.draw()
	}

}
