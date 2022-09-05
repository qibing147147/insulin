<template>
  <div class="scroller" @scroll="handleScroll">
    <div class="container" :style="{ paddingTop: `${scrollTop}px` }">
      <div v-for="item in renderData" :key="item.id" class="item" :style="{paddingLeft: item.level * 20 + 'px'}">
        {{ item.id }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, computed } from 'vue';

const props = defineProps({
  data: Array
})


const worker = new Worker('worker.js')
let now = Date.now()
let i = 1

let treeData = reactive([])

watch(() => props.data, (val) => {
  console.log(val)
  worker.postMessage({
    type: 'init',
    data: JSON.stringify(val)
  })
}, {
  deep: true
})

let scrollTop = ref(0)

const startIndex = computed(() => {
  return Math.floor(scrollTop.value / 25)
})

const renderData = computed(() => {
  return treeData.slice(startIndex.value, startIndex.value + 50)
})

worker.onmessage = (e) => {
  treeData.length = 0
  let data
  if (typeof e.data === 'string') {
    data = JSON.parse(e.data)
  } else {
    data = JSON.parse(e.data.data)
    console.log('onmessage', Date.now() - now)
    console.log('onmessage startIndex', e.data.startIndex)
    console.log('onmessage i', i)
    i += 1
  }
  treeData = reactive(data)
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
