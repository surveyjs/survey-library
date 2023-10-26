<template>
  <component :is="getComponentName()" v-bind="getComponentData()" />
</template>

<script lang="ts" setup>
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
