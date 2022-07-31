import * as svg from "./svgelems.mjs"
import { convertCoordsToImage as convertCoords } from "./main.mjs"
import { drawHandle } from "./handle.mjs"

export class Tool {

	constructor(image) {
		this.points = []
		this.image = image
	}

	draw(ctx, imageScale) {
		for (let p of this.points) {
			drawHandle(ctx, [p[0], p[1]])
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

	draw(ctx) {
		super.draw(ctx)
		if (this.points.length == 2) {
			ctx.moveTo(this.points[0][0], this.points[0][1])
			ctx.lineTo(this.points[1][0], this.points[1][1])
			ctx.stroke()
		}
	}

	beginDrag(e) {
		this.points[0] = [e.x, e.y]
		this.points[1] = undefined
	}

	drag(e) {
		this.points[1] = [e.x, e.y]
	}

	endDrag(e) {
		this.image.addElement(new svg.SVGLine(15, convertCoords(this.points[0]), convertCoords([e.x, e.y]), null, null))
		this.points = []
	}

}

export class QuadBezier extends Tool {

	draw(ctx) {
		super.draw(ctx)
		if (this.points.length == 3) {
			ctx.moveTo(this.points[0][0], this.points[0][1])
			ctx.quadraticCurveTo(this.points[1][0], this.points[1][1], this.points[2][0], this.points[2][1])
			ctx.stroke()
		}
	}

	beginDrag(e) {
		this.points[0] = [e.x, e.y]
		this.points[1] = undefined
		this.points[2] = undefined
	}

	drag(e) {
		this.points[2] = [e.x, e.y]
		let delta = [(this.points[2][0] - this.points[0][0]) / 2, (this.points[2][1] - this.points[0][1]) / 2]
		this.points[1] = [this.points[0][0] + delta[0] + delta[1], this.points[0][1] + delta[1] - delta[0]]
		console.log(this.points)
	}
	// y = m * x + c
	// y - m * x = c

	endDrag(e) {
		this.points[2] = [e.x, e.y]
		let delta = [(this.points[2][0] - this.points[0][0]) / 2, (this.points[2][1] - this.points[0][1]) / 2]
		this.points[1] = [this.points[0][0] + delta[0] + delta[1], this.points[0][1] + delta[1] - delta[0]]

		this.image.addElement(new svg.SVGQuadBezier(15, convertCoords(this.points[0]), convertCoords(this.points[1]), convertCoords([e.x, e.y]), null, null))
		this.points = []
	}

}

export const tools = [Line, QuadBezier]
