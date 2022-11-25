<template>
  <div @click="add">
    {{num}} * 2 = {{double}}
  </div>
</template>

<script setup>
import reac from './index'

console.log('reac', reac)
</script>