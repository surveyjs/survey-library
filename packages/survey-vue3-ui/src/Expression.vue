<template>
  <div :class="question.cssClasses.root" ref="root">
    {{ question.formatedValue }}
  </div>
</template>

<script lang="ts" setup>
import type { QuestionExpressionModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionExpressionModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
