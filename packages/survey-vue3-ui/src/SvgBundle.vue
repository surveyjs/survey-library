<template>
  <svg id="sv-icon-holder-global-container" ref="root" v-show="false"></svg>
</template>
<script setup lang="ts">
import { SvgRegistry } from "survey-core";
import { onMounted, onUnmounted, ref } from "vue";
const root = ref();
const onIconsChanged = () => {
  if (root.value) {
    root.value.innerHTML = SvgRegistry.iconsRenderedHtml();
  }
};
onMounted(() => {
  onIconsChanged();
  SvgRegistry.onIconsChanged.add(onIconsChanged);
});
onUnmounted(() => {
  SvgRegistry.onIconsChanged.remove(onIconsChanged);
});
</script>
