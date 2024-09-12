<template>
  <button
    type="button"
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
import type { Action } from "survey-core";
import { useMatrixAction } from "../matrix-action";
const props = defineProps<{ item: Action }>();
const { question, row } = useMatrixAction(props);
</script>
