<template>
  <component
    :ref="root"
    :is="getComponentName(contentQuestion)"
    :question="contentQuestion"
    :css="css"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { QuestionCustomModel, Question } from "survey-core";
import { getComponentName as getComponent, useQuestion } from "./base";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionCustomModel; css?: any }>();

const root = ref(null);

useQuestion(props, root);

const contentQuestion = computed((): Question => {
  return props.question.contentQuestion;
});
const getComponentName = (element: Question): string => {
  return getComponent(element);
};
</script>
