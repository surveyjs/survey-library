<template>
  <slot v-if="hasContentComponent && !componentName"></slot>
  <SurveyVueComponent v-else :name="componentName" v-bind="componentData" />
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import { computed, useSlots } from "vue";
defineProps<{
  componentName?: string;
  componentData: any;
}>();

const slots = useSlots();
const hasContentComponent = computed(() => !!slots.default);
</script>
