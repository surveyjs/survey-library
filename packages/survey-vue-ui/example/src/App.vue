<script setup lang="ts">
import Example from './components/example/Example.vue';
import Test from "./components/test/Test.vue"

const isTest = !!(window as any)["%hammerhead%"];

</script>

<template>
  <Example v-if="!isTest"></Example>
  <Test v-if="isTest"></Test>
</template>

<style scoped>
</style>
