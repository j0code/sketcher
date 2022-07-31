export function drawHandle(ctx, p) {
	ctx.fillStyle = "#ff0000"
	ctx.beginPath()
	ctx.arc(p.x, p.y, 1, 0, 2 * Math.PI, true)
	ctx.fill()
	ctx.beginPath()
	ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI, true)
	ctx.stroke()
}
