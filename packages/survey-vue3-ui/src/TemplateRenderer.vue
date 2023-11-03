<template>
  <slot v-if="hasContentComponent && !componentName"></slot>
  <component v-else :is="componentName" v-bind="componentData" />
</template>

<script lang="ts" setup>
import { computed, useSlots } from "vue";
defineProps<{
  componentName?: string;
  componentData: any;
}>();

const slots = useSlots();
const hasContentComponent = computed(() => !!slots.default);
</script>
