import { e } from "./util.mjs"
import Point from "./Point.mjs"
import Color from "./Color.mjs"
import * as prop from "./propview.mjs"
import Handle from "./handle.mjs"

export class SVGElement {

	constructor(type, points, stroke, fill) {
		this.type = type
		this.id = null
		this.points = points
		this.stroke = stroke
		this.fill = fill
		this.handles = []
		for (let p of points) this.handles.push(new Handle(p))
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

	getPointLabel(index = 0) {
		return null
	}

	getProperties() {
		let a = []
		for (let i in this.points) {
			const p = this.points[i]
			a.push(prop.pointDiv(p, this.getPointLabel(i), i))
		}
		a.push(prop.colorDiv(this.stroke, "stroke"), prop.colorDiv(this.fill, "fill"))
		return a
	}

	setImage(img) {
		for (let p of this.points) {
			p.image = img
		}
	}

}

export class SVGGroup extends SVGElement {

	constructor(pos, stroke, fill) {
		super("g", [pos], stroke, fill)
		this.children = []
		this.collapsed = true
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
		if (this.collapsed) div.classList.add("collapsed")

		caret.innerText = ">" // TODO: replace with icon
		caret.on("click", () => {
			this.collapsed = !this.collapsed
			div.classList.toggle("collapsed")
		})

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
		super(new Point(0, 0), null, null)
		this.type = "svg"
	}

	getProperties() {
		return [prop.colorDiv(this.stroke, "stroke"), prop.colorDiv(this.fill, "fill")]
	}

}

export class SVGLine extends SVGElement {

	constructor(a, b, stroke, fill) {
		super("line", [a, b], stroke, fill)
	}

	draw(ctx, scale) {
		ctx.beginPath()
		ctx.moveTo(this.A.x * scale, this.A.y * scale)
		ctx.lineTo(this.B.x * scale, this.B.y * scale)
		ctx.stroke()
	}

	getPointLabel(index = 0) {
		const labels = ["A","B"]
		return labels[index]
	}

	get A() {
		return this.points[0]
	}

	get B() {
		return this.points[1]
	}

}

export class SVGQuadBezier extends SVGElement {

	constructor(a, b, c, stroke, fill) {
		super("Quadratic Bezièr Curve", [a, b, c], stroke, fill)
		this.a = a
		this.b = b
		this.c = c
	}

	draw(ctx, scale) {
		ctx.beginPath()
		ctx.moveTo(this.A.x * scale, this.A.y * scale)
		ctx.quadraticCurveTo(this.B.x * scale, this.B.y * scale, this.C.x * scale, this.C.y * scale)
		ctx.stroke()
	}

	getPointLabel(index = 0) {
		const labels = ["A","B","C"]
		return labels[index]
	}

	get A() {
		return this.points[0]
	}

	get B() {
		return this.points[1]
	}

	get C() {
		return this.points[2]
	}

}

export class SVGCubicBezier extends SVGElement {

	constructor(a, b, c, d, stroke, fill) {
		super("Cubic Bezièr Curve", [a, b, c, d], stroke, fill)
		this.a = a
		this.b = b
		this.c = c
		this.d = d
	}

	draw(ctx, scale) {
		ctx.beginPath()
		ctx.moveTo(this.A.x * scale, this.A.y * scale)
		ctx.bezierCurveTo(this.B.x * scale, this.B.y * scale, this.C.x * scale, this.C.y * scale, this.D.x * scale, this.D.y * scale)
		ctx.stroke()
	}

	getPointLabel(index = 0) {
		const labels = ["A","B","C","D"]
		return labels[index]
	}

	get A() {
		return this.points[0]
	}

	get B() {
		return this.points[1]
	}

	get C() {
		return this.points[2]
	}

	get D() {
		return this.points[3]
	}

}
