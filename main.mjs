import { $, e } from "./util.mjs"
import SvgImage from "./image.mjs"
import DrawScheduler from "./drawscheduler.mjs"
import * as tools from "./tool.mjs"
import MouseEvents from "./mouseevents.mjs"
import { drawHandle } from "./handle.mjs"
import Point from "./Point.mjs"
import updatePropertyView from "./propview.mjs"

const canvas = $("#sketch")
const image  = new SvgImage(1920, 1080, "#ffffff")
let tool     = null
const mouseEvents = new MouseEvents($("body"), $("#sketch"))
export const setTool = (t) => tool = t
let draggingHandle = null

const scheduler = new DrawScheduler(30, draw)
window.scheduler = scheduler

let imageRotation = 0

function draw() {

	canvas.width  = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	const ctx = canvas.getContext("2d")
	ctx.fillStyle = "#202020"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.save()
	ctx.translate(canvas.width/2, canvas.height/2)
	ctx.translate(image.offset.x, image.offset.y)
	//ctx.rotate(imageRotation)
	//ctx.scale(image.scale, image.scale)
	ctx.translate(-image.width/2 * image.scale, -image.height/2 * image.scale)

	if (image.shouldRedraw) image.draw()
	ctx.drawImage(image.canvas, 0, 0)
	ctx.restore()

	if (tool) tool.draw(ctx)
	if (image.selectedElement) {
		let handles = image.getSelected().handles
		for (let handle of handles) {
			handle.draw(ctx)
		}
	}

}

export function updateTree() {
	const tree = $("#tree")
	const svg  = image.svg
	tree.innerHTML = ""
	tree.appendChild(svg.tree())
}

export function getImage() {
	return image
}

image.redraw()
updateTree()
updatePropertyView(image.svg)

window.addEventListener("resize", draw)

mouseEvents.on("drag", e => {
	if (tool instanceof tools.Tool) {
		tool.drag(e)
		return
	} else if (draggingHandle) {
		draggingHandle.drag(e)
		image.redraw()
		return
	}
	image.offset.x += e.dx
	image.offset.y += e.dy
	if (image.offset.x < -image.width /2 * image.scale) image.offset.x = -image.width /2 * image.scale
	if (image.offset.y < -image.height/2 * image.scale) image.offset.y = -image.height/2 * image.scale
	if (image.offset.x >  image.width /2 * image.scale) image.offset.x =  image.width /2 * image.scale
	if (image.offset.y >  image.height/2 * image.scale) image.offset.y =  image.height/2 * image.scale
})

mouseEvents.on("wheel", e => {
	/*if (e.ctrl) { // I'll add this later, this just adds complexity
		console.log(e)
		let deg = Math.round(imageRotation * 180 / Math.PI)
		console.log(deg)
		if (e.dy > 0) imageRotation += 1 / 12 * Math.PI
		if (e.dy < 0) imageRotation -= 1 / 12 * Math.PI
		deg %= 360
		//imageRotation = deg * Math.PI / 180
		imageRotation %= 2 * Math.PI
		return
	}*/
	if (e.dy > 0) image.scale /= 1.125
	if (e.dy < 0) image.scale *= 1.125
	let ref = Math.min(image.width, image.height)
	if (image.scale * ref < 200) image.scale = 200 / ref
	if (image.scale > 2) image.scale = 2
})

mouseEvents.on("begindrag", e => {
	$("#sketch").classList.add("dragging")
	if (tool) {
		tool.beginDrag(e)
	} else if (image.selectedElement) {
		let handles = image.getSelected().handles
		let touching = []
		for (let handle of handles) {
			if (handle.touching(e)) touching.push(handle)
		}
		if (touching.length == 1) {
			draggingHandle = touching[0]
		} else if (touching.length > 1) {
			console.warn("Touching multiple handles!", touching)
		}
	}
})

mouseEvents.on("enddrag", e => {
	$("#sketch").classList.remove("dragging")
	if (tool) {
		tool.endDrag(e)
	}
	draggingHandle = null
})

mouseEvents.on("move", e => {
	if (tool) {
		$("#sketch").classList.remove("move")
	} else {
		$("#sketch").classList.add("move")
	}
})

const toolbar = $("#toolbar")

const div = e("div.toolbar-tool")
div.innerText = "Move"
div.dataset.toolId = -1
div.on("click", () => tool = null)
toolbar.appendChild(div)

for (let i in tools.tools) {
	const t = tools.tools[i]
	const div = e("div.toolbar-tool")
	div.innerText = t.name
	div.dataset.toolId = i
	div.on("click", () => tool = t)
	toolbar.appendChild(div)
}

export function convertCoordsToImage(coords) {
	// ctx.translate(canvas.width/2 - (image.width/2 * imageScale), canvas.height/2 - (image.height/2 * imageScale))
	return new Point((coords.x - canvas.width/2 - image.offset.x) / image.scale + image.width/2, (coords.y - canvas.height/2 - image.offset.y) / image.scale + image.height/2)
}

export function convertCoordsToCanvas(coords) {
	// ctx.translate(canvas.width/2 - (image.width/2 * imageScale), canvas.height/2 - (image.height/2 * imageScale))
	//return [canvas.width/2 - (image.width/2 * imageScale) + coords[0] + imageOffset[0], canvas.height/2 - (image.height/2 * imageScale) + coords[1] + imageOffset[1]]
	return new Point(canvas.width/2 + image.offset.x + (-image.width/2 + coords.x) * image.scale, canvas.height/2 + image.offset.y + (-image.height/2 + coords.y) * image.scale)
}
