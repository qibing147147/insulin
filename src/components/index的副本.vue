<template>
  <div class="scroller" @scroll="handleScroll">
    <div class="container" :style="{ paddingTop: `${scrollTop}px` }">
      <div v-for="item in treeData" :key="item.id" class="item" :style="{paddingLeft: item.level * 20 + 'px'}">
        {{ item.id }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';


const worker = new Worker('worker.js')
let now = Date.now()
let i = 1

let data: any[] = []
let treeData = reactive([])
let scrollTop = ref(0)

onMounted(() => {
  setData()
})

worker.onmessage = (e) => {
  treeData.length = 0
  if (typeof e.data === 'string') {
    data = JSON.parse(e.data)
  } else {
    data = JSON.parse(e.data.data)
    console.log('onmessage', Date.now() - now)
    console.log('onmessage startIndex', e.data.startIndex)
    console.log('onmessage i', i)
    i += 1
  }
  treeData.push(...data)
}

function setData () {
  worker.postMessage({
    type: 'init'
  })
}
function flat (data, level = 1) {
  const res = []
  const len = data.length

  for (let i = 0; i < len; i++) {
    const cur = data[i]
    res.push({
      ...cur,
      level
    })
    if (cur.children) {
      res.push(...flat(cur.children, level + 1))
    }
  }
  return res
}

function handleScroll (e: UIEvent) {
  e.preventDefault()
  const startIndex = Math.floor(e.target!.scrollTop / 25)
  console.log('startIndex', startIndex)
  if (now) {
    console.log('scroll', Date.now() - now)
  }
  console.log('scroll i', i)
  now = Date.now()
  worker.postMessage({
    startIndex
  })
  scrollTop.value = e.target!.scrollTop
  // this.treeData = this.data.slice(startIndex, startIndex + 50)
}
</script>

<style lang="scss" scoped>
.scroller {
  height: 100%;
  overflow: auto;
}

.container {
  height: 25000000px;
}

.item {
  height: 25px;
  line-height: 25px;
}
</style>
