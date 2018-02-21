<template>
    <td :class="question.cssClasses.itemValue">
        <survey-errors :question="cell.question" />
        <component v-show="cell.question.visible" :is="getWidgetComponentName(cell.question)" :question="cell.question" />
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
  getWidgetComponentName(element: Question) {
    if (element.customWidget) {
      return "survey-customwidget";
    }
    return "survey-" + element.getType();
  }
  mounted() {
    if (!this.cell || !this.cell.question || !this.cell.question.survey) return;
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
}

Vue.component("survey-matrixcell", MatrixCell);
    export default MatrixCell;
</script>
