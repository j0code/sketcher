export function $(q) {
	let e = document.querySelector(q)
	if (e && e.addEventListener) e.on = e.addEventListener
	return e
}

export function $$(q) {
	let es = document.querySelectorAll(q)
	if (es) {
		for (e of es) {
			if (e && e.addEventListener) e.on = e.addEventListener
		}
	}
	return es
}

export function e(q) {
	var q = cssQuery(q)
	if(!q.tag) return null
	var el = document.createElement(q.tag)
	if(q.id) el.id = q.id
	if(q.className) el.className = q.className
	if(q.attrs) for(var a in q.attrs) el[a] = q.attrs[a]
	el.on = el.addEventListener
	return el
}

// thanks to Denys Séguret on https://stackoverflow.com/questions/17888039/javascript-efficient-parsing-of-css-selector
// slightly altered
function cssQuery(q) {
  var obj = {tag: "", classes: [], id: "", attrs: {}, className: ""}
  if(q) q.split(/(?=\.)|(?=#)|(?=\[)/).forEach(token => {
    switch (token[0]) {
      case '#':
        obj.id = token.slice(1)
        break
      case '.':
        obj.classes.push(token.slice(1))
        break;
      case '[':
				var a = token.slice(1,-1).split(';')
        for(var b of a) {
          var kv = b.split("=")
  				obj.attrs[kv[0]] = kv[1]
        }
        break
      default:
        obj.tag = token
        break
    }
  })
	obj.className = obj.classes.join(" ")
  return obj
}
