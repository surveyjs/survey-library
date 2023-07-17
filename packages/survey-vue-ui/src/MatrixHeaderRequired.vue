<template>
  <span
    v-if="column.isRenderedRequired"
    :class="question.cssClasses.cellRequiredText"
    >{{ column.requiredText }}</span
  >
</template>

<script lang="ts" setup>
import type { Question, MatrixDropdownColumn } from "survey-core";
import { useBase } from "./base";
const props = defineProps<{
  question: Question;
  column: MatrixDropdownColumn;
}>();
useBase(() => props.column);
</script>
