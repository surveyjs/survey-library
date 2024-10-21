<template>
  <button
    type="button"
    :id="getId(row)"
    :class="question.getRemoveRowButtonCss()"
    :disabled="question.isInputReadOnly"
    @click="() => question.removeRowUI(row)"
  >
    <SvComponent :is="'survey-string'" :locString="question.locRemoveRowText" />
    <span :class="question.cssClasses.iconRemove"></span>
  </button>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { Action, MatrixDropdownRowModelBase } from "survey-core";
import { useMatrixAction } from "../matrix-action";
const props = defineProps<{ item: Action }>();
const { question, row } = useMatrixAction(props);
const getId = (panel: MatrixDropdownRowModelBase): string => {
  return question.value.getPanelRemoveButtonId(panel);
};
</script>
