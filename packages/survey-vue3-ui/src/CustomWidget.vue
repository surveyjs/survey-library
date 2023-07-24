<template>
  <div ref="root">
    <div v-if="hasHtml" v-html="customHtml"></div>
    <component
      v-if="hasDefaultRender"
      :is="componentName"
      :question="question"
      :css="css"
    />
  </div>
</template>
<script lang="ts" setup>
import type { Question } from "survey-core";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
const props = defineProps<{
  question: Question;
  css?: any;
}>();
const root = ref<HTMLElement>();
const hasDefaultRender = computed(
  () => props.question.customWidget.isDefaultRender
);
const hasHtml = computed(() =>
  props.question.customWidget.htmlTemplate ? true : false
);
const customHtml = computed(() => props.question.customWidget.htmlTemplate);
const componentName = computed(() => "survey-" + props.question.getTemplate());

onMounted(() => {
  props.question.customWidget.afterRender(props.question, root.value);
});
onBeforeUnmount(() => {
  props.question.customWidget.willUnmount(props.question, root.value);
});
</script>
