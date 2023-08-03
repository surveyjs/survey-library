<template>
  <template v-if="column.isRenderedRequired">
    <span>&nbsp;</span>
    <span
      v-if="column.isRenderedRequired"
      :class="question.cssClasses.cellRequiredText"
      >{{ column.requiredText }}</span
    >
  </template>
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
