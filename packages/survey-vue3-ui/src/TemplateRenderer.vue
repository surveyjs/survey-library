<template>
  <component
    :is="getComponentName()"
    v-bind="getComponentData()"
  />
</template>

<script lang="ts" setup>
import { useBase } from "./base";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  componentName: string;
  componentData: any;
}>();

const getComponentName = () => {
  return props.componentName;
};
const getComponentData = () => {
  return props.componentData;
};
</script>
