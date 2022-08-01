import * as svg from "./svgelems.mjs"
import { updateTree, setTool, getImage } from "./main.mjs"
import { drawHandle } from "./handle.mjs"
import Point from "./Point.mjs"

export class Tool {

	constructor(name) {
		this.name = name
		this.elem = null
	}

	draw(ctx) {
		if (!this.elem) return
		this.elem.draw(ctx, 1)
		let handles = this.elem.handles
		for (let handle of handles) {
			handle.draw(ctx)
		}
	}

	click(e) { // called when mouse was pressed, then released without moving

	}

	move(e) { // called whenever mouse moved, unless dragging

	}

	beginDrag(e) { // called when mouse was pressed, then moved without releasing

	}

	drag(e) { // like move, but only when dragging

	}

	endDrag(e) { // called when mouse is released and was dragging

	}

}

export class Line extends Tool {

	constructor() {
		super("Line")
	}

	beginDrag(e) {
		this.elem = new svg.SVGLine(new Point(e.x, e.y), new Point(e.x, e.y), null, null)
	}

	drag(e) {
		this.elem.B.set(e.x, e.y)
	}

	endDrag(e) {
		this.drag(e)
		getImage().addElement(this.elem)
		this.elem = null
		updateTree()
		setTool(null)
	}

}

export class QuadBezier extends Tool {

	constructor() {
		super("QuadBezier")
	}

	beginDrag(e) {
		this.elem = new svg.SVGQuadBezier(new Point(e.x, e.y), new Point(e.x, e.y), new Point(e.x, e.y))
	}

	drag(e) {
		this.elem.C.set(e.x, e.y)
		let delta = new Point((this.elem.C.x - this.elem.A.x) / 2, (this.elem.C.y - this.elem.A.y) / 2)
		this.elem.B.set(new Point(this.elem.A.x + delta.x + delta.y * 1.5, this.elem.A.y + delta.y - delta.x * 1.5))
	}

	endDrag(e) {
		this.drag(e)

		getImage().addElement(this.elem)
		this.elem = null
		updateTree()
		setTool(null)
	}

}

export class CubicBezier extends Tool {

	constructor() {
		super("CubicBezier")
	}

	beginDrag(e) {
		this.elem = new svg.SVGCubicBezier(new Point(e.x, e.y), new Point(e.x, e.y), new Point(e.x, e.y), new Point(e.x, e.y))
	}

	drag(e) {
		this.elem.D.set(e.x, e.y)
		let delta = new Point((this.elem.D.x - this.elem.A.x) / 2, (this.elem.D.y - this.elem.A.y) / 2)
		this.elem.B.set(new Point(this.elem.A.x + delta.x * 1 + delta.y * 0.5, this.elem.A.y + delta.y * 1 - delta.x * 0.5))
		this.elem.C.set(new Point(this.elem.A.x + delta.x * 1 - delta.y * 0.5, this.elem.A.y + delta.y * 1 + delta.x * 0.5))
	}

	endDrag(e) {
		this.drag(e)

		getImage().addElement(this.elem)
		this.elem = null
		updateTree()
		setTool(null)
	}

}

export const tools = [new Line(), new QuadBezier(), new CubicBezier()]
