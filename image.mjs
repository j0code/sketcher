import { e } from "./util.mjs"
import * as svg from "./svgelems.mjs"
import nextID from "./idassigner.mjs"
import Point from "./Point.mjs"
import updatePropertyView from "./propview.mjs"

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
		this.offset  = new Point(0, 0)
		this.svg     = new svg.SVGRootElement()
		this.elems   = new Map() // id => SVGElement
		this.selectedElement = null
		this.shouldRedraw = false

		this.svg.id = nextID(this.elems)
		this.svg.setImage(this)
	}

	redraw() {
		this.shouldRedraw = true
	}

	draw() {

		const ctx = this.canvas.getContext("2d")
		ctx.clearRect(0, 0, this.#width * this.#scale, this.#height * this.#scale)
		ctx.fillStyle = this.bgColor
		ctx.fillRect(0, 0, this.#width * this.#scale, this.#height * this.#scale)
		if (window.c) this.bgColor = window.c

		this.svg.draw(ctx, this.#scale)

		this.shouldRedraw = false

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
		if (!(e instanceof svg.SVGElement)) return
		let id = nextID(this.elems)
		e.id = id
		e.setImage(this)

		this.elems.set(id, e)
		this.svg.children.push(e)
		this.setSelected(e.id)
	}

	get(id) {
		return this.elems.get(id)
	}

	getSelected() {
		return this.selectedElement ? this.get(this.selectedElement) : this.svg
	}

	setSelected(id) {
		this.selectedElement = id == this.svg.id ? null : id
		updatePropertyView(this.getSelected())
		this.redraw()
	}

}
