<template>
  <label v-if="!cell.isErrorsCell" :class="question.getItemLabelCss(item)">
    <span :class="question.getItemTitleCss()"
      :style="{ minWidth: question.itemTitleWidth, width: question.itemTitleWidth }">
      <span v-if="item.editor.isRequireTextBeforeTitle ||
        item.editor.isRequireTextOnStart
        " :class="question.cssClasses.requiredText">{{ item.editor.requiredText }}</span>
      <survey-string :locString="item.locTitle" />
      <span v-if="item.editor.isRequireTextAfterTitle">&nbsp;</span>
      <span v-if="item.editor.isRequireTextAfterTitle" aria-hidden="true" :class="question.cssClasses.requiredText">{{
        item.editor.requiredText }}</span>
    </span>
    <div :key="item.editor.id" :class="question.getItemCss()" v-on:focusin="item.focusIn()">
      <component :is="getComponentName(item.editor)" :question="item.editor" />
    </div>
  </label>
  <survey-errors v-else :element="item.editor" />
</template>

<script lang="ts" setup>
import type {
  Question,
  QuestionMultipleTextModel,
  MultipleTextCell,
} from "survey-core";
import { getComponentName as getComponent, useBase } from "./base";
import { computed } from "vue";

const props = defineProps<{
  question: QuestionMultipleTextModel;
  cell: MultipleTextCell;
}>();
const getComponentName = (question: Question) => {
  return getComponent(question);
};
useBase(() => props.cell.item.editor);
const item = computed(() => props.cell.item);
</script>
