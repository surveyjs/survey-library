<template>
  <td :class="getCellClass()" :headers="getHeaders()">
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
    var q = this.cell.question;
    return q.isVisible && q.survey.questionErrorLocation === "top";
  }
  get hasErrorsOnBottom() {
    var q = this.cell.question;
    return q.isVisible && q.survey.questionErrorLocation === "bottom";
  }
  getHeaders() {
    var element = this.cell.question;
    if (!element) return "";
    return element.isVisible ? this.cell.cell.column.locTitle.renderedHtml : "";
  }
  getCellClass() {
    var element = this.cell.question;
    if (!element) return this.question.cssClasses.cell;

    var cellClass = element.cssClasses.itemValue;

    if (!!element.errors && element.errors.length > 0) {
      cellClass += " " + element.cssClasses.hasError;
    }

    cellClass += " " + element.cssClasses.asCell;

    return cellClass;
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
