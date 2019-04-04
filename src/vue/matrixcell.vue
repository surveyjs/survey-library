<template>
  <td
    :class="getQuestionClass(cell.question)"
    :headers="cell.question.isVisible ? cell.column.locTitle.renderedHtml : ''"
  >
    <survey-errors v-if="hasErrorsOnTop" :question="cell.question" :location="'top'"/>
    <component
      v-show="isVisible"
      :is="getWidgetComponentName(cell.question)"
      :question="cell.question"
    />
    <survey-errors v-if="hasErrorsOnBottom" :question="cell.question" :location="'bottom'"/>
  </td>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { surveyCss } from "../defaultCss/cssstandard";
import { Question } from "../question";
import { MatrixDropdownCell } from "../question_matrixdropdownbase";

@Component
export class MatrixCell extends Vue {
  @Prop question: Question;
  @Prop cell: MatrixDropdownCell;
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

  getQuestionClass(element: Question) {
    var classes = element.cssClasses.itemValue;

    if (!!element.errors && element.errors.length > 0) {
      classes += " " + element.cssClasses.hasError;
    }

    return classes;
  }

  mounted() {
    if (!this.cell || !this.cell.question || !this.cell.question.survey) return;
    this.onVisibilityChanged();
    var self = this;
    this.cell.question.registerFunctionOnPropertyValueChanged(
      "isVisible",
      function() {
        self.onVisibilityChanged();
      }
    );
    var options = {
      cell: this.cell,
      cellQuestion: this.cell.question,
      htmlElement: this.$el,
      row: this.cell.row,
      column: this.cell.column
    };
    this.cell.question.survey.matrixAfterCellRender(
      this.cell.question,
      options
    );
  }
  private onVisibilityChanged() {
    this.isVisible = this.cell.question.isVisible;
  }
}

Vue.component("survey-matrixcell", MatrixCell);
export default MatrixCell;
</script>
