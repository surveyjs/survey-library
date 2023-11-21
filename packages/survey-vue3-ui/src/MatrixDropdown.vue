<template>
  <survey-matrixtable :question="question" ref="root" />
</template>

<script lang="ts" setup>
import type { QuestionMatrixDropdownModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionMatrixDropdownModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
