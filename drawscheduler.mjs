import { $, e } from "./util.mjs"

export default class DrawScheduler {

	#frameCount; #maxFps; #interval; #lastTime; #frameTimes; #lastSecond; #secondFrames; #draw
	constructor(fps = 30, draw = () => {}) {
		this.#frameCount = 0

		this.#maxFps     = fps
		this.#interval   = 1000 / fps
		this.#lastTime   = Date.now()

		this.#frameTimes = []

		this.#lastSecond = Date.now()
		this.#secondFrames = [0]

		this.#draw       = draw

		requestAnimationFrame(() => this.loop())
	}

	loop() {
		let t = Date.now()
		let diff = t - this.#lastTime

		if (t - this.#lastSecond > 1000) {
			this.#secondFrames.unshift(0)
			if (this.#secondFrames.length > 10) this.#secondFrames.pop()
			this.#lastSecond += 1000
		}

		if (diff > this.#interval) {
			this.#lastTime = t - (diff % this.#interval)
			this.#draw()
			this.#frameCount++
			this.#frameTimes.unshift(Date.now() - t)
			if (this.#frameTimes.length > 200) this.#frameTimes.pop()
			this.#secondFrames[0]++
		}

		requestAnimationFrame(() => this.loop())
	}

	get frameCount() {
		return this.#frameCount
	}

	get maxFps() {
		return this.#maxFps
	}

	get fps() {
		let total = 0
		for (let i = 1; i < this.#secondFrames.length; i++) {
			let t = this.#secondFrames[i]
			total += t
		}
		return Math.floor(((total / (this.#secondFrames.length-1)) || 0) * 10) / 10
	}

	get avgFrameTime() {
		let total = 0
		for (let t of this.#frameTimes) {
			total += t
		}
		return Math.floor(((total / this.#frameTimes.length) || 0) * 100) / 100
	}

	get debug() {
		return this.#secondFrames
	}

	set fps(fps = 30) {
		this.#maxFps = fps
		this.#interval = 1000 / fps
	}

}
