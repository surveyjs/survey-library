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
      <component
        :is="getComponentName(item.editor)"
        :question="item.editor"
      />
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

<script lang="ts">
import { Question, MultipleTextItemModel, QuestionMultipleTextModel } from "survey-core";
import { defineSurveyComponent, getComponentName } from "./base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-multipletext-item",
  props: {
    question: QuestionMultipleTextModel,
    item: MultipleTextItemModel,
  },
  data: (vm: any) => {
    return {
      getModel: () => {
        return vm.item.editor;
      },
      getComponentName: (question: Question) => {
        return getComponentName(question);
      },
    };
  },
});
</script>
