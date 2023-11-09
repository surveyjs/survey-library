<template>
  <svg ref="svgIconElement" class="sv-svg-icon" role="img">
    <use></use>
  </svg>
</template>

<script lang="ts" setup>
import { createSvg } from "survey-core";
import { ref, onUpdated, onMounted } from "vue";

const props = defineProps<{
  size: string | number;
  width?: number;
  height?: number;
  iconName: string;
  title?: string;
}>();
const svgIconElement = ref();
const updateCallback = () => {
  createSvg(
    props.size,
    props.width as number,
    props.height as number,
    props.iconName,
    svgIconElement.value,
    props.title as string
  );
};
onUpdated(() => {
  updateCallback();
});
onMounted(() => {
  updateCallback();
});
</script>
