import * as svg from "./svgelems.mjs"
import { convertCoordsToImage as convertCoords } from "./main.mjs"

export class Tool {

	constructor(image) {
		this.points = []
		this.image = image
	}

	draw(ctx, imageScale) {

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

	draw(ctx, imageScale) {
		if (this.points.length == 0) return
		if (this.points.length >= 1) {
			ctx.fillStyle = "#ff0000"
			for (let p of this.points) {
				ctx.beginPath()
				ctx.arc(p[0] * imageScale, p[1] * imageScale, 1, 0, 2 * Math.PI, true)
				ctx.fill()
				ctx.beginPath()
				ctx.arc(p[0] * imageScale, p[1] * imageScale, 10, 0, 2 * Math.PI, true)
				ctx.stroke()
			}
		}
		if (this.points.length == 2) {
			ctx.moveTo(this.points[0][0] * imageScale, this.points[0][1] * imageScale)
			ctx.lineTo(this.points[1][0] * imageScale, this.points[1][1] * imageScale)
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
		this.image.draw()
		this.points = []
	}

}

export const tools = [Line]
