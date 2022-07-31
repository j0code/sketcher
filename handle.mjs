export function drawHandle(ctx, pos) {
	ctx.fillStyle = "#ff0000"
	ctx.beginPath()
	ctx.arc(pos[0], pos[1], 1, 0, 2 * Math.PI, true)
	ctx.fill()
	ctx.beginPath()
	ctx.arc(pos[0], pos[1], 10, 0, 2 * Math.PI, true)
	ctx.stroke()
}
