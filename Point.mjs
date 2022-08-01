export default class Point {

	constructor(x = 0, y = 0, z = 0) {
		this.x = x
		this.y = y
		this.z = z
	}

	sqDistance(p) {
		return (this.x-p.x) ** 2 + (this.y-p.y) ** 2
	}

	distance(p) {
		return Math.sqrt(this.sqDistance(p))
	}

}
