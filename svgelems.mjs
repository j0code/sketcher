import { e } from "./util.mjs"
import Point from "./Point.mjs"
import Color from "./Color.mjs"
import * as prop from "./propview.mjs"
import Handle from "./handle.mjs"

export class SVGElement {

	constructor(type, points, stroke, fill) {
		this.type = type
		this.id = null
		this.image = null
		this.points = points
		this.stroke = stroke
		this.fill = fill
		this.handles = []
		for (let p of points) this.handles.push(new Handle(p))
	}

	draw(ctx, scale) {}

	tree(a = []) {
		const div    = e(`div.tree-elem#${this.getDOMId()}`)
		const head   = e("div.tree-elem-head")
		const icon   = e("div.tree-elem-icon") // TODO: change to img or svg
		const label  = e("span.tree-elem-label")

		div.dataset.id  = this.id
		div.on("click", e => {
			for (let i in e.path) {
				if (e.path[i].classList.contains("tree-elem")) {
					if (e.path[i].dataset.id != this.id) return
					break
				}
			}
			this.image.setSelected(this.id)
		})
		label.innerText  = this.getTreeLabel()

		head.push(icon, label)
		div.push(head)
		if (a) {
			a.div   = div
			a.head  = head
			a.icon  = icon
			a.label = label
		}
		return div
	}

	getDOMId() {
		return this instanceof SVGRootElement ? "tree-root" : `tree-elem-${this.id}`
	}

	getTreeLabel() {
		return `${this.type} ${this.points}`
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
		this.image = img
	}

	toSvg() {}
	toSvgPath() {}

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

	toSvg() {
		let inner = ""
		for (let c of this.children) {
			inner += c.toSvg()
		}
		return `<g>${inner}</g>`
	}

}

export class SVGRootElement extends SVGGroup {

	constructor() {
		super(new Point(0, 0), null, null)
		this.type   = "svg"
		this.width  = 500
		this.height = 300
	}

	getTreeLabel() {
		return `svg`
	}

	getProperties() {
		return [prop.numberDiv(this.width, "width"), prop.numberDiv(this.height, "height"), prop.colorDiv(this.stroke, "stroke"), prop.colorDiv(this.fill, "fill")]
	}

	toSvg() {
		let inner = ""
		for (let c of this.children) {
			inner += c.toSvg()
		}
		return `<svg viewBox="0 0 ${this.width} ${this.height}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`
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

	getTreeLabel() {
		return `line ${this.A.floor()}, ${this.B.floor()}`
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

	toSvg() {
		return `<line x1="${this.A.x}" y1="${this.A.y}" x2="${this.B.x}" y2="${this.B.y}" style="stroke:rgb(0,0,0);stroke-width:1"></line>`
	}

	toSvgPath() {
		return `M ${this.A.x} ${this.A.y} L ${this.B.x} ${this.B.y}`
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

	getTreeLabel() {
		return `curve ${this.A.floor()}, ${this.C.floor()}`
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

	toSvg() {
		return `<path d="${this.toSvgPath()}" style="stroke:rgb(0,0,0);stroke-width:1;fill:none" />`
	}

	toSvgPath() {
		return `M ${this.A.x} ${this.A.y} Q ${this.B.x} ${this.B.y} ${this.C.x} ${this.C.y}`
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

	getTreeLabel() {
		return `curve ${this.A.floor()}, ${this.D.floor()}`
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

	toSvg() {
		return `<path d="${this.toSvgPath()}" style="stroke:rgb(0,0,0);stroke-width:1;fill:none" />`
	}

	toSvgPath() {
		return `M ${this.A.x} ${this.A.y} C ${this.B.x} ${this.B.y} ${this.C.x} ${this.C.y} ${this.D.x} ${this.D.y}`
	}

}
