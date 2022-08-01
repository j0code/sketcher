import * as svg from "./svgelems.mjs"
import { convertCoordsToImage as convertCoords, updateTree, setTool, getImage } from "./main.mjs"
import { drawHandle } from "./handle.mjs"
import Point from "./Point.mjs"

export class Tool {

	constructor(name) {
		this.points = []
		this.name = name
	}

	draw(ctx, imageScale) {
		for (let p of this.points) {
			drawHandle(ctx, p)
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

	draw(ctx) {
		super.draw(ctx)
		if (this.points.length == 2) {
			ctx.moveTo(this.points[0].x, this.points[0].y)
			ctx.lineTo(this.points[1].x, this.points[1].y)
			ctx.stroke()
		}
	}

	beginDrag(e) {
		this.points[0] = new Point(e.x, e.y)
		this.points[1] = undefined
	}

	drag(e) {
		this.points[1] = new Point(e.x, e.y)
	}

	endDrag(e) {
		this.points[1] = new Point(e.x, e.y)
		getImage().addElement(new svg.SVGLine(convertCoords(this.points[0]), convertCoords(this.points[1]), null, null))
		this.points = []
		updateTree()
		setTool(null)
	}

}

export class QuadBezier extends Tool {

	constructor() {
		super("QuadBezier")
	}

	draw(ctx) {
		super.draw(ctx)
		if (this.points.length == 3) {
			ctx.moveTo(this.points[0].x, this.points[0].y)
			ctx.quadraticCurveTo(this.points[1].x, this.points[1].y, this.points[2].x, this.points[2].y)
			ctx.stroke()
		}
	}

	beginDrag(e) {
		this.points[0] = new Point(e.x, e.y)
		this.points[1] = undefined
		this.points[2] = undefined
	}

	drag(e) {
		this.points[2] = new Point(e.x, e.y)
		let delta = new Point((this.points[2].x - this.points[0].x) / 2, (this.points[2].y - this.points[0].y) / 2)
		this.points[1] = new Point(this.points[0].x + delta.x + delta.y, this.points[0].y + delta.y - delta.x)
	}

	endDrag(e) {
		this.points[2] = new Point(e.x, e.y)
		let delta = new Point((this.points[2].x - this.points[0].x) / 2, (this.points[2].y - this.points[0].y) / 2)
		this.points[1] = new Point(this.points[0].x + delta.x + delta.y, this.points[0].y + delta.y - delta.x)

		getImage().addElement(new svg.SVGQuadBezier(convertCoords(this.points[0]), convertCoords(this.points[1]), convertCoords(this.points[2]), null, null))
		this.points = []
		updateTree()
		setTool(null)
	}

}

export const tools = [new Line(), new QuadBezier()]
