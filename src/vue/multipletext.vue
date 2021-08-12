<template>
  <table :class="question.cssClasses.root">
    <tr
      v-for="(row, rowindex) in question.getRows()"
      :key="question.inputId + 'rowkey' + rowindex"
      :class="question.cssClasses.row"
    >
      <template v-for="item in row">
        <td
          :key="'label' + item.editor.id"
          :class="question.getItemTitleCss(question.cssClasses)"
        >
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
        </td>
        <td :key="item.editor.id" :css="question.getItemCss(question.cssClasses)">
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
        </td>
      </template>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { Question } from "survey-core";
import { QuestionMultipleTextModel } from "survey-core";

@Component
export class MultipleText extends QuestionVue<QuestionMultipleTextModel> {
  getComponentName(question: Question) {
    if (question.customWidget) {
      return "survey-customwidget";
    }
    return "survey-text";
  }
  get hasErrorsOnTop() {
    return this.question.survey.questionErrorLocation === "top";
  }
  get hasErrorsOnBottom() {
    return this.question.survey.questionErrorLocation === "bottom";
  }
}
Vue.component("survey-multipletext", MultipleText);
export default MultipleText;
</script>
