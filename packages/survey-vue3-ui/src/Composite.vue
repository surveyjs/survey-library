<template>
  <survey-panel ref="root" :element="contentPanel" :css="css" />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { QuestionCompositeModel } from "survey-core";
import { useQuestion } from "./base";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionCompositeModel; css?: object }>();
const root = ref(null);
useQuestion(props, root);
const contentPanel = computed(() => {
  return props.question.contentPanel;
});
</script>
