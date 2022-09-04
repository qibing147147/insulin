let data = []
onmessage = function (e) {
  if (e.data.type === 'init') {
    fetch('./data.json')
      .then(res => res.json())
      .then(res => {
        const start = performance.now()
        data = flat(res)
        const end = performance.now()
        console.log('flat', end - start)
        postMessage(JSON.stringify(data.slice(0, 50)))
      })
  } else {
    const startIndex = e.data.startIndex
    postMessage({
      data: JSON.stringify(data.slice(startIndex, startIndex + 50)),
      startIndex
    })
  }
}

function handleData (data) {
  const res = []
  while (data.length) {
    const cur = { ...data.shift() }
    res.push(cur)
    if (Array.isArray(cur.children)) {
      data.unshift(...cur.children)
    }
    delete cur.children
  }
  return res
}

function flat (data) {
  const res = []
  let index = 0
  const loop = (children, level = 1) => {
    const len = children.length

    for (let i = 0; i < len; i++) {
      const cur = children[i]
      res.push({
        ...cur,
        level,
        __index__: index
      })
      index += 1
      if (cur.children) {
        loop(cur.children, level + 1)
      }
    }
  }
  loop(data)
  return res
}
