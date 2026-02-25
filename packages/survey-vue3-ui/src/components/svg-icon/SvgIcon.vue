<template>
  <svg ref="svgIconElement" :class="css" role="presentation">
    <use></use>
  </svg>
</template>

<script lang="ts" setup>
import { createSvg } from "survey-core";
import { ref, onUpdated, onMounted, computed } from "vue";

const props = defineProps<{
  size: string | number;
  width?: number;
  height?: number;
  iconName: string;
  title?: string;
  className?: string;
  css?: string;
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
const css = computed(() => props.css || ("sv-svg-icon" + (props.className ? " " + props.className : "")));
onUpdated(() => {
  updateCallback();
});
onMounted(() => {
  updateCallback();
});
</script>
