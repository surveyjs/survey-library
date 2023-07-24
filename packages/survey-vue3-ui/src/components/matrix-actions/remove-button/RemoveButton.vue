<template>
  <button
    type="button"
    :class="question.getRemoveRowButtonCss()"
    :disabled="question.isInputReadOnly"
    @click="() => question.removeRowUI(row)"
  >
    <survey-string :locString="question.locRemoveRowText" />
    <span :class="question.cssClasses.iconRemove"></span>
  </button>
</template>

<script lang="ts" setup>
import type { Action } from "survey-core";
import { useMatrixAction } from "../matrix-action";
const props = defineProps<{ item: Action }>();
const { question, row } = useMatrixAction(props);
</script>
