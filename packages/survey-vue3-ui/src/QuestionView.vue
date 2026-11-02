<template>
  <div :id="question.inputId" :class="question.viewModeCssClass" ref="root">
    {{ question.viewDisplayText }}
  </div>
</template>

<script lang="ts" setup>
import type { Question } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";

defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: Question }>();
const root = ref(null);
useQuestion(props, root);
</script>
