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
          :class="question.cssClasses.itemTitle + ' ' + question.cssClasses.cell"
        >
          <span
            v-if="item.editor.isRequireTextBeforeTitle || item.editor.isRequireTextOnStart"
            :class="question.cssClasses.requiredText"
          >{{item.editor.requiredText}}</span>
          <survey-string :locString="item.locTitle" />
          <span
            v-if="item.editor.isRequireTextAfterTitle"
            :class="question.cssClasses.requiredText"
          >{{item.editor.requiredText}}</span>
        </td>
        <td :key="item.editor.id" :css="question.cssClasses.cell">
          <survey-errors v-if="hasErrorsOnTop" :question="item.editor" :location="'top'" />
          <component :is="getWidgetComponentName(item.editor)" :question="item.editor" />
          <survey-errors v-if="hasErrorsOnBottom" :question="item.editor" :location="'bottom'" />
        </td>
      </template>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { Question } from "../question";
import { QuestionMultipleTextModel } from "../question_multipletext";

@Component
export class MultipleText extends QuestionVue<QuestionMultipleTextModel> {
  getWidgetComponentName(question: Question) {
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
