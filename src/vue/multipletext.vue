<template>
  <table :class="question.cssClasses.root">
    <tr
      v-for="(row, rowindex) in question.getRows()"
      :key="question.inputId + 'rowkey' + rowindex"
      :class="question.cssClasses.row"
    >
      <template v-for="item in row">
        <td :key="'item' + item.editor.id" :class="question.cssClasses.cell">
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
        </td>
      </template>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
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
    return this.question.survey.questionErrorLocation === "top" && !this.question.isErrorsModeTooltip
  }
  get hasErrorsOnBottom() {
    return this.question.survey.questionErrorLocation === "bottom" && !this.question.isErrorsModeTooltip
  }
}
Vue.component("survey-multipletext", MultipleText);
export default MultipleText;
</script>
