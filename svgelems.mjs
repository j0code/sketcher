import { e } from "./util.mjs"

export class SVGElement {

	constructor(type, id, pos, stroke, fill) {
		this.type = type
		this.id = id
		this.pos = pos
		this.stroke = stroke
		this.fill = fill
	}

	draw(ctx, scale) {}

	tree(a = []) {
		const id    = this instanceof SVGRootElement ? "tree-root" : `tree-elem-${this.id}`
		const div   = e(`div.tree-elem#${id}`)
		const head  = e("div.tree-elem-head")
		const icon  = e("div.tree-elem-icon") // TODO: change to img or svg
		const name  = e("span.tree-elem-name")

		name.innerText  = this.type

		head.push(icon, name)
		div.push(head)
		if (a) {
			a.div  = div
			a.head = head
			a.icon = icon
			a.name = name
		}
		return div
	}

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

	tree(a = []) {
		const div = super.tree(a)
		const caret = e("div.tree-elem-caret")
		const childDiv = e("div.tree-group-children")

		div.classList.add("tree-group")
		div.classList.add("collapsed")

		caret.innerText = ">"
		caret.on("click", () => div.classList.toggle("collapsed"))

		for (let c of this.children) {
			childDiv.push(c.tree())
		}

		a.head.prepend(caret)
		div.push(childDiv)
		return div
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
		ctx.moveTo(this.pos[0] * scale, this.pos[1] * scale)
		ctx.quadraticCurveTo(this.pos2[0] * scale, this.pos2[1] * scale, this.pos3[0] * scale, this.pos3[1] * scale)
		ctx.stroke()
	}

}
