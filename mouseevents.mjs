export default class MouseEvents {

	#dragging; #pressing; #x; #y; #pressInfo; #listeners
	constructor(a, b = a) {
		a.on("mousemove",   e => this.#move(e))
		b.on("mousewheel",  e => this.#wheel(e), {passive: false})
		b.on("mousedown",   e => this.#down(e))
		a.on("mouseup",     e => this.#up(e))
		b.on("contextmenu", e => e.preventDefault())
		this.#dragging = false
		this.#pressing = false
		this.#x = 0
		this.#y = 0
		this.#pressInfo = null // [startTime, startX, startY, alt, ctrl, shift]
		this.#listeners = {begindrag: [], drag: [], enddrag: [], move: [], wheel: [], click: []}
		this.elem = b
	}

	#move(e) {
		//console.dir(this.elem)
		//console.log(e.x - this.elem.offsetLeft - this.elem.width/2, e.y - this.elem.offsetTop  - this.elem.height/2)
		this.#x = e.x - this.elem.offsetLeft
		this.#y = e.y - this.elem.offsetTop
		if (this.#pressing) {
			if (!this.#dragging && Date.now() - this.#pressInfo[0] > 100) { // 100ms passed since mouse down
				this.#dragging = true

				let evt = new MouseEvent("begindrag", this.#pressInfo[1], this.#pressInfo[2], e.movementX, e.movementY, this.#pressing, this.#dragging, this.#pressInfo[3], this.#pressInfo[4], this.#pressInfo[5])
				this.#emit(evt)
			}
			if (this.#dragging) {
				let evt = new MouseEvent("drag", this.#x, this.#y, e.movementX, e.movementY, this.#pressing, this.#dragging, this.#pressInfo[3], this.#pressInfo[4], this.#pressInfo[5])
				evt.dragTime = Date.now() - this.#pressInfo
				this.#emit(evt)
			} else {
				// emit nothing? maybe move
			}
		} else {
			let evt = new MouseEvent("move", this.#x, this.#y, e.movementX, e.movementY, this.#pressing, this.#dragging, e.altKey, e.ctrlKey, e.shiftKey)
			this.#emit(evt)
		}
	}

	#wheel(e) {
		if (e.target == this.elem) e.preventDefault()
		let keyInfo = this.pressing ? [this.#pressInfo[3], this.#pressInfo[4], this.#pressInfo[5]] : [e.altKey, e.ctrlKey, e.shiftKey]
		let evt = new MouseEvent("wheel", e.x - this.elem.offsetLeft, e.y - this.elem.offsetTop, e.deltaX, e.deltaY, this.#pressing, this.#dragging, keyInfo[0], keyInfo[1], keyInfo[2])
		this.#emit(evt)
	}

	#down(e) {
		this.#pressing = true
		this.#pressInfo = [Date.now(), e.x - this.elem.offsetLeft, e.y - this.elem.offsetTop, e.altKey, e.ctrlKey, e.shiftKey]
		e.preventDefault()
	}

	#up(e) {
		if (this.#dragging) {
			let evt = new MouseEvent("enddrag", e.x - this.elem.offsetLeft, e.y - this.elem.offsetTop, this.#pressInfo[1]-e.offsetX, this.#pressInfo[2]-e.offsetY, this.#pressing, this.#dragging, this.#pressInfo[3], this.#pressInfo[4], this.#pressInfo[5])
			evt.dragTime = Date.now() - this.#pressInfo[0]
			this.#emit(evt)
		} else if(this.#pressing) { // this should always be the case but I guess js does not care
			let evt = new MouseEvent("click", e.x - this.elem.offsetLeft, e.y - this.elem.offsetTop, this.#pressInfo[1]-e.offsetX, this.#pressInfo[2]-e.offsetY, this.#pressing, this.#dragging, this.#pressInfo[3], this.#pressInfo[4], this.#pressInfo[5])
			evt.pressTime = Date.now() - this.#pressInfo[0]
			this.#emit(evt)
		}

		this.#pressing = false
		this.#dragging = false
		this.#pressInfo = null
	}

	#emit(e) {
		for (let cb of this.#listeners[e.type]) {
			cb(e)
		}
	}

	on(type, cb) {
		if (["begindrag","drag","enddrag","move","wheel","click"].includes(type)) {
			this.#listeners[type].push(cb)
		}
	}

}

class MouseEvent {

	constructor(type, x = 0, y = 0, dx = 0, dy = 0, pressing = false, dragging = false, alt = false, ctrl = false, shift = false) {
		if (!type) throw new TypeError("Failed to construct 'MouseEvent': 1 argument required, but 0 present.")
		this.type = type
		this.x = x
		this.y = y
		this.dx = dx
		this.dy = dy
		this.pressing = pressing
		this.dragging = dragging
		this.alt = alt
		this.ctrl = ctrl
		this.shift = shift
	}

}
