let i = Math.floor(Math.random() * 65536)

export default function nextID(map) {

	i %= 65536 // 16 ** 4
	let t = (Date.now() % 65536).toString(16)
	let id = fillZeros((i++).toString(16), 4) + fillZeros(t, 4)
	
	if (map.has(id)) return nextID(map)
	return id

}

function fillZeros(n, len) {
	while (n.length < len) n = "0" + n
	return n
}
