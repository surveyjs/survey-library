<template>
  <slot v-if="hasContentComponent && !componentName"></slot>
  <SvComponent v-else :is="componentName" v-bind="componentData" />
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { computed, useSlots } from "vue";
defineProps<{
  componentName?: string;
  componentData: any;
}>();

const slots = useSlots();
const hasContentComponent = computed(() => !!slots.default);
</script>
