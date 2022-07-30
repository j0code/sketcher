import { $, e } from "./util.mjs"
import SvgImage from "./image.mjs"
import DrawScheduler from "./drawscheduler.mjs"
import * as tools from "./tool.mjs"
import MouseEvents from "./mouseevents.mjs"

const canvas = $("#sketch")
const image  = new SvgImage(500, 300, "#ffffff")
let tool     = null
const mouseEvents = new MouseEvents($("body"), $("#sketch"))

const scheduler = new DrawScheduler(30, draw)
window.scheduler = scheduler

let imageOffset = [0, 0]
let imageScale  = 1
window.imageRotation = 0

function draw() {

	canvas.width  = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	const ctx = canvas.getContext("2d")
	ctx.fillStyle = "#202020"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.save()
	ctx.translate(canvas.width/2, canvas.height/2)
	ctx.translate(imageOffset[0], imageOffset[1])
	ctx.rotate(imageRotation)
	ctx.scale(imageScale, imageScale)
	ctx.translate(-image.width/2, -image.height/2)

	ctx.drawImage(image.canvas, 0, 0)
	ctx.restore()

	if (tool) tool.draw(ctx, imageScale)

}

image.draw()

window.addEventListener("resize", draw)

mouseEvents.on("drag", e => {
	if (tool instanceof tools.Tool) {
		e.x = e.x / imageScale
		e.y = e.y / imageScale
		tool.drag(e)
		return
	}
	imageOffset[0] += e.dx
	imageOffset[1] += e.dy
	if (imageOffset[0] < -image.width /2) imageOffset[0] = -image.width /2
	if (imageOffset[1] < -image.height/2) imageOffset[1] = -image.height/2
	if (imageOffset[0] >  image.width /2) imageOffset[0] =  image.width /2
	if (imageOffset[1] >  image.height/2) imageOffset[1] =  image.height/2
})

mouseEvents.on("wheel", e => {
	if (e.dy > 0) imageScale *= 1.125
	if (e.dy < 0) imageScale /= 1.125
	let ref = Math.min(image.width, image.height)
	if (imageScale * ref < 200) imageScale = 200 / ref
	if (imageScale > 2) imageScale = 2
})

mouseEvents.on("begindrag", e => {
	if (tool) {
		e.x = e.x / imageScale
		e.y = e.y / imageScale
		tool.beginDrag(e)
	}
})

mouseEvents.on("enddrag", e => {
	if (tool) {
		e.x = e.x / imageScale
		e.y = e.y / imageScale
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
	return [coords[0] - imageOffset[0] - canvas.width/2 + (image.width/2 * imageScale), coords[1] - imageOffset[1] - canvas.height/2 + (image.height/2 * imageScale)]
}

export function convertCoordsToCanvas(coords) {
	// ctx.translate(canvas.width/2 - (image.width/2 * imageScale), canvas.height/2 - (image.height/2 * imageScale))
	return [canvas.width/2 - (image.width/2 * imageScale) + coords[0] + imageOffset[0], canvas.height/2 - (image.height/2 * imageScale) + coords[1] + imageOffset[1]]
}
