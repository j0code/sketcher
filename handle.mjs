import { convertCoordsToImage, convertCoordsToCanvas } from "./main.mjs"
import Point from "./Point.mjs"

export function drawHandle(ctx, p) {
	ctx.fillStyle = "#ff0000"
	ctx.beginPath()
	ctx.arc(p.x, p.y, 1, 0, 2 * Math.PI, true)
	ctx.fill()
	ctx.beginPath()
	ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI, true)
	ctx.stroke()
}

export default class Handle {

	constructor(point) {
		this.point = point
	}

	draw(ctx) {
		drawHandle(ctx, convertCoordsToCanvas(this.point))
	}

	drag(e) {
		let coords = convertCoordsToImage(new Point(e.x, e.y))
		this.point.x = coords.x
		this.point.y = coords.y
	}

	touching(point) {
		return convertCoordsToCanvas(this.point).sqDistance(point) < 100 // 10**2 (10=radius)
	}

}
