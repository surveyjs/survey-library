<template>
  <div :class="question.cssClasses.text" ref="root">
    {{ question.formatedValue }}
  </div>
</template>

<script lang="ts" setup>
import type { QuestionExpressionModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
const props = defineProps<{ question: QuestionExpressionModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
