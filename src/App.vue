
<template>
  <tree :data="treeData" />
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import tree from './components/index.vue'
import axios from 'axios'
import { reactive } from 'vue';

const treeData = reactive([])

axios.get('./data.json').then(res => {
  treeData.push(res.data)
})



</script>
  
<style scoped>


.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
