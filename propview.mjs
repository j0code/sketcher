import { $, e } from "./util.mjs"
import { SVGRootElement } from "./svgelems.mjs"

export default function updatePropertyView(elem) {
	const properties = $("#properties")
	const icon  = $("#properties-icon")
	const label = $("#properties-label")
	const preview = $("#preview")

	label.innerText = elem instanceof SVGRootElement ? "svg root" : `${elem.type} #${elem.id}`

	properties.innerHTML = ""
	properties.append(...elem.getProperties())

	const svg = elem instanceof SVGRootElement ? elem.toSvg() : `<svg viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">${elem.toSvg()}</svg>`
	preview.innerHTML = svg
}

export function pointDiv(point, _label, index = 0) {
	const div   = e("div.property.property-point")
	const label = e("span.property-label")
	const x     = numberDiv(point.x, "x", index)
	const y     = numberDiv(point.y, "y", index)

	if (_label) label.innerText = _label + ":"

	if (_label) div.append(label)
	div.append(x, y)
	return div
}

export function colorDiv(color, _label) {
	const div   = e("div.property.property-point")
	const label = e("label.property-label")
	const value = e("input.property-value[type=color]")

	label.innerText = _label + ":"
	value.arialabel = _label + " color"
	value.title = _label + " color"

	div.append(label, value)
	return div
}

export function numberDiv(n, _label, index = "") {
	const div   = e("div.property-number")
	const label = e("label.property-label")
	const value = e("input.property-value[type=number]")

	label.innerText = _label + ":"
	value.value = n
	value.step = 0.1
	value.placeholder = "0"
	value.arialabel = _label + index
	value.title = _label + index

	div.append(label, value)
	return div
}
