<template>
  <label :class="question.getItemLabelCss(item)">
    <span :class="question.getItemTitleCss()">
      <span
        v-if="
          item.editor.isRequireTextBeforeTitle ||
          item.editor.isRequireTextOnStart
        "
        :class="question.cssClasses.requiredText"
        >{{ item.editor.requiredText }}</span
      >
      <survey-string :locString="item.locTitle" />
      <span
        v-if="item.editor.isRequireTextAfterTitle"
        :class="question.cssClasses.requiredText"
        >{{ item.editor.requiredText }}</span
      >
    </span>
    <div :key="item.editor.id" :class="question.getItemCss()">
      <survey-errors
        v-if="item.editor.showErrorOnTop"
        :element="item.editor"
        :location="'top'"
      />
      <component :is="getComponentName(item.editor)" :question="item.editor" />
      <survey-errors
        v-if="item.editor.showErrorOnBottom"
        :element="item.editor"
        :location="'bottom'"
      />
    </div>
    <survey-errors
      v-if="item.editor.isErrorsModeTooltip"
      :element="item.editor"
      :location="'tooltip'"
    />
  </label>
</template>

<script lang="ts" setup>
import type {
  Question,
  MultipleTextItemModel,
  QuestionMultipleTextModel,
} from "survey-core";
import { getComponentName as getComponent, useBase } from "./base";

const props = defineProps<{
  question: QuestionMultipleTextModel;
  item: MultipleTextItemModel;
}>();
const getComponentName = (question: Question) => {
  return getComponent(question);
};

useBase(() => props.item.editor);
</script>
