<template>
  <SvComponent
    :ref="root"
    :is="getComponentName(contentQuestion)"
    :question="contentQuestion"
    :css="css"
  />
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { computed, ref } from "vue";
import type { QuestionCustomModel, Question } from "survey-core";
import { getComponentName as getComponent, useBase, useQuestion } from "./base";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionCustomModel; css?: any }>();

const root = ref(null);

useQuestion(props, root);
const contentQuestion = computed((): Question => {
  return props.question.contentQuestion;
});
useBase(() => contentQuestion.value);
const getComponentName = (element: Question): string => {
  return getComponent(element);
};
</script>
