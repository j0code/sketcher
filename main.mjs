import { $, e } from "./util.mjs"
import SvgImage from "./image.mjs"
import DrawScheduler from "./drawscheduler.mjs"
import * as tools from "./tool.mjs"
import MouseEvents from "./mouseevents.mjs"
import { drawHandle } from "./handle.mjs"

const canvas = $("#sketch")
const image  = new SvgImage(1920, 1080, "#ffffff")
let tool     = null
const mouseEvents = new MouseEvents($("body"), $("#sketch"))

const scheduler = new DrawScheduler(30, draw)
window.scheduler = scheduler

let imageOffset = [0, 0]
let imageRotation = 0

function draw() {

	canvas.width  = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	const ctx = canvas.getContext("2d")
	ctx.fillStyle = "#202020"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.save()
	ctx.translate(canvas.width/2, canvas.height/2)
	ctx.translate(imageOffset[0], imageOffset[1])
	//ctx.rotate(imageRotation)
	//ctx.scale(image.scale, image.scale)
	ctx.translate(-image.width/2 * image.scale, -image.height/2 * image.scale)

	ctx.drawImage(image.canvas, 0, 0)
	ctx.restore()

	if (tool) tool.draw(ctx)

}

export function updateTree() {
	const tree = $("#tree")
	const svg  = image.svg
	tree.innerHTML = ""
	tree.appendChild(svg.tree())
}

image.draw()
updateTree()

window.addEventListener("resize", draw)

mouseEvents.on("drag", e => {
	if (tool instanceof tools.Tool) {
		tool.drag(e)
		return
	}
	imageOffset[0] += e.dx
	imageOffset[1] += e.dy
	if (imageOffset[0] < -image.width /2 * image.scale) imageOffset[0] = -image.width /2 * image.scale
	if (imageOffset[1] < -image.height/2 * image.scale) imageOffset[1] = -image.height/2 * image.scale
	if (imageOffset[0] >  image.width /2 * image.scale) imageOffset[0] =  image.width /2 * image.scale
	if (imageOffset[1] >  image.height/2 * image.scale) imageOffset[1] =  image.height/2 * image.scale
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
	if (tool) {
		tool.beginDrag(e)
	}
})

mouseEvents.on("enddrag", e => {
	if (tool) {
		tool.endDrag(e)
	}
})

const toolbar = $("#toolbar")

const div = e("div.toolbar-tool")
div.innerText = "Move"
div.dataset.toolId = -1
div.on("click", () => tool = null)
toolbar.appendChild(div)

for (let i in tools.tools) {
	const Tool = tools.tools[i]
	const div = e("div.toolbar-tool")
	div.innerText = Tool.name
	div.dataset.toolId = i
	div.on("click", () => tool = new Tool(image))
	toolbar.appendChild(div)
}

export function convertCoordsToImage(coords) {
	// ctx.translate(canvas.width/2 - (image.width/2 * imageScale), canvas.height/2 - (image.height/2 * imageScale))
	return [(coords[0] - canvas.width/2 - imageOffset[0]) / image.scale + image.width/2, (coords[1] - canvas.height/2 - imageOffset[1]) / image.scale + image.height/2]
}

export function convertCoordsToCanvas(coords) {
	// ctx.translate(canvas.width/2 - (image.width/2 * imageScale), canvas.height/2 - (image.height/2 * imageScale))
	//return [canvas.width/2 - (image.width/2 * imageScale) + coords[0] + imageOffset[0], canvas.height/2 - (image.height/2 * imageScale) + coords[1] + imageOffset[1]]
	return [canvas.width/2 + imageOffset[0] + (-image.width/2 + coords[0]) * image.scale, canvas.height/2 + imageOffset[1] + (-image.height/2 + coords[1]) * image.scale]
}
