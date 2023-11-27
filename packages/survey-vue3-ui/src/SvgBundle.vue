<template>
  <svg id="sv-icon-holder-global-container" ref="root" v-show="false"></svg>
</template>
<script setup lang="ts">
import { SvgRegistry } from "survey-core";
import { onMounted, ref } from "vue";
const root = ref();
onMounted(() => {
  root.value.innerHTML = SvgRegistry.iconsRenderedHtml();
});
</script>
