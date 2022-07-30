export class SVGElement {

	constructor(type, id, pos, stroke, fill) {
		this.type = type
		this.id = id
		this.pos = pos
		this.stroke = stroke
		this.fill = fill
	}

	draw(ctx) {}

}

export class SVGGroup extends SVGElement {

	constructor(id, pos, stroke, fill) {
		super("g", id, pos, stroke, fill)
		this.children = []
	}

	draw(ctx) {

		for (let e of this.children) {
			e.draw(ctx)
		}

	}

}

export class SVGRootElement extends SVGGroup {

	constructor() {
		super(-1, [0, 0], null, null)
		this.type = "svg"
	}

}

export class SVGLine extends SVGElement {

	constructor(id, pos, pos2, stroke, fill) {
		super("line", id, pos, stroke, fill)
		this.pos2 = pos2
		console.log(pos, pos2)
	}

	draw(ctx) {
		ctx.moveTo(this.pos[0], this.pos[1])
		ctx.lineTo(this.pos2[0], this.pos2[1])
		ctx.stroke()
	}

}
