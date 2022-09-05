let data = []
onmessage = function (e) {
  if (e.data.type === 'init') {
    data = flat(JSON.parse(e.data.data))
    postMessage(JSON.stringify(data))
  } else {
    postMessage(JSON.stringify(data.slice(e.data.startIndex, e.data.startIndex + 50)))
  }
}

function flat (data) {
  const res = []
  while (data.length) {
    const cur = data.shift()
    res.push(cur)
    if (Array.isArray(cur.children)) {
      data.unshift(...cur.children)
    }
  }
  return res
}