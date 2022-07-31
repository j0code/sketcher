export class SVGElement {

	constructor(type, id, pos, stroke, fill) {
		this.type = type
		this.id = id
		this.pos = pos
		this.stroke = stroke
		this.fill = fill
	}

	draw(ctx, scale) {}
	tree() {}

}

export class SVGGroup extends SVGElement {

	constructor(id, pos, stroke, fill) {
		super("g", id, pos, stroke, fill)
		this.children = []
	}

	draw(ctx, scale) {

		for (let e of this.children) {
			e.draw(ctx, scale)
		}

	}

	tree() {
		
	}

}

export class SVGRootElement extends SVGGroup {

	constructor() {
		super(-1, [0, 0], null, null)
		this.type = "svg"
	}

}

export class SVGLine extends SVGElement {

	constructor(id, a, b, stroke, fill) {
		super("line", id, a, stroke, fill)
		this.pos2 = b
	}

	draw(ctx, scale) {
		ctx.moveTo(this.pos[0] * scale, this.pos[1] * scale)
		ctx.lineTo(this.pos2[0] * scale, this.pos2[1] * scale)
		ctx.stroke()
	}

}

export class SVGQuadBezier extends SVGElement {

	constructor(id, a, b, c, stroke, fill) {
		super("quadbezier", id, a, stroke, fill)
		this.pos2 = b
		this.pos3 = c
	}

	draw(ctx, scale) {
		ctx.moveTo(this.pos[0], this.pos[1])
		ctx.quadraticCurveTo(this.pos2[0], this.pos2[1], this.pos3[0], this.pos3[1])
		ctx.stroke()
	}

}
