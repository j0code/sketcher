import { $ } from "./util.mjs"

export default class Point {

	#image
	constructor(x = 0, y = 0, z = 0, image) {
		this.x = x
		this.y = y
		this.z = z
		this.#image = image
	}

	sqDistance(p) {
		return (this.x-p.x) ** 2 + (this.y-p.y) ** 2
	}

	distance(p) {
		return Math.sqrt(this.sqDistance(p))
	}

	set(x = 0, y = 0, z = 0) {
		if (x instanceof Point) return this.set(x.x, x.y, x.z)
		this.x = x
		this.y = y
		this.z = z
	}

	setOnCanvas(x = 0, y = 0, z = 0) {
		if (!(x instanceof Point)) return this.setOnCanvas(new Point(x, y, z))
		if (this.#image) {
			this.set(convertToImage(x, this.#image))
		} else {
			this.set(x)
		}
	}

	onCanvas() {
		if (this.#image) {
			return convertToCanvas(this, this.#image)
		} else {
			return this
		}
	}

	set image(img) {
		this.#image = img
		if (img) this.set(convertToImage(this, img))
		else this.set(convertToCanvas(this, img))
	}

}

function convertToCanvas(point, image) {
	return new Point($("#sketch").width /2 + image.offset.x + (-image.width /2 + point.x) * image.scale,
									 $("#sketch").height/2 + image.offset.y + (-image.height/2 + point.y) * image.scale)
}

function convertToImage(point, image) {
	return new Point((point.x - $("#sketch").width /2 - image.offset.x) / image.scale + image.width /2,
									 (point.y - $("#sketch").height/2 - image.offset.y) / image.scale + image.height/2)
}
