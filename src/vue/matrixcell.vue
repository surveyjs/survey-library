<template>
  <td :class="getQuestionClass()" :headers="getHeaders()">
    <div v-if="cell.hasQuestion">
      <survey-errors v-if="hasErrorsOnTop" :question="cell.question" :location="'top'" />
      <component
        v-show="isVisible"
        :is="getWidgetComponentName(cell.question)"
        :question="cell.question"
      />
      <survey-errors v-if="hasErrorsOnBottom" :question="cell.question" :location="'bottom'" />
    </div>
    <button
      v-if="cell.isRemoveRow"
      type="button"
      :class="question.cssClasses.button + ' ' + question.cssClasses.buttonRemove"
      @click="removeRowClick()"
    >
      <span>{{question.removeRowText}}</span>
      <span :class="question.cssClasses.iconRemove"></span>
    </button>
    <survey-string v-if="cell.hasTitle" :locString="cell.locTitle" />
  </td>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { surveyCss } from "../defaultCss/cssstandard";
import { Question } from "../question";
import {
  MatrixDropdownCell,
  QuestionMatrixDropdownRenderedCell
} from "../question_matrixdropdownbase";

@Component
export class MatrixCell extends Vue {
  @Prop question: Question;
  @Prop cell: QuestionMatrixDropdownRenderedCell;

  isVisible: boolean = false;
  getWidgetComponentName(element: Question) {
    if (element.customWidget) {
      return "survey-customwidget";
    }
    return "survey-" + element.getType();
  }
  get hasErrorsOnTop() {
    return this.cell.question.survey.questionErrorLocation === "top";
  }
  get hasErrorsOnBottom() {
    return this.cell.question.survey.questionErrorLocation === "bottom";
  }
  getHeaders() {
    var element = this.cell.question;
    if (!element) return "";
    return element.isVisible ? this.cell.cell.column.locTitle.renderedHtml : "";
  }
  getQuestionClass() {
    var element = this.cell.question;
    if (!element) return "";
    var classes = element.cssClasses.itemValue;

    if (!!element.errors && element.errors.length > 0) {
      classes += " " + element.cssClasses.hasError;
    }

    classes += " " + element.cssClasses.asCell;

    return classes;
  }
  removeRowClick() {
    this.question.removeRowUI(this.cell.row);
  }
  mounted() {
    if (!this.cell.hasQuestion || !this.question || !this.question.survey)
      return;
    this.onVisibilityChanged();
    var self = this;
    this.cell.question.registerFunctionOnPropertyValueChanged(
      "isVisible",
      function() {
        self.onVisibilityChanged();
      }
    );
    var options = {
      cell: this.cell.cell,
      cellQuestion: this.cell.question,
      htmlElement: this.$el,
      row: this.cell.row,
      column: this.cell.cell.column
    };
    this.question.survey.matrixAfterCellRender(this.question, options);
  }
  private onVisibilityChanged() {
    this.isVisible = this.cell.question.isVisible;
  }
}

Vue.component("survey-matrixcell", MatrixCell);
export default MatrixCell;
</script>
