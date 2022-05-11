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
        v-if="hasErrorsOnTop"
        :element="item.editor"
        :location="'top'"
      />
      <component
        :is="getComponentName(item.editor)"
        :question="item.editor"
      />
      <survey-errors
        v-if="hasErrorsOnBottom"
        :element="item.editor"
        :location="'bottom'"
      />
    </div>
    <survey-errors
      v-if="question.isErrorsModeTooltip"
      :element="item.editor"
      :location="'tooltip'"
    />
  </label>
</template>

<script lang="ts">

import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { MultipleTextItemModel, Question } from "survey-core";
import { QuestionMultipleTextModel } from "survey-core";
import BaseVue from "./base";

@Component
export class MultipleTextItem extends BaseVue {
  @Prop()
  question: QuestionMultipleTextModel;
  @Prop()
  item: MultipleTextItemModel

  getModel() {
    return this.item.editor;
  }
  getComponentName(question: Question) {
    if (question.customWidget) {
      return "survey-customwidget";
    }
    return "survey-text";
  }
  get hasErrorsOnTop() {
    return this.question.survey.questionErrorLocation === "top" && !this.question.isErrorsModeTooltip
  }
  get hasErrorsOnBottom() {
    return this.question.survey.questionErrorLocation === "bottom" && !this.question.isErrorsModeTooltip
  }
}
Vue.component("survey-multipletext-item", MultipleTextItem);
export default MultipleTextItem;
</script>
