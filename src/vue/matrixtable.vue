<template>
  <table :class="question.cssClasses.root">
    <thead v-if="table.showHeader">
      <tr>
        <th
          v-for="cell in table.headerRow.cells"
          :key="'header_' + cell.id"
          :style="{ minWidth: cell.minWidth }"
        >
          <survey-string :locString="cell.locTitle"/>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in table.rows" :key="question.inputId + '_' + rowIndex">
        <survey-matrixcell
          :cell="cell"
          :question="question"
          v-for="(cell, cellIndex) in row.cells"
          :key="rowIndex + '_' + cellIndex"
        />
      </tr>
    </tbody>
    <tfoot v-if="table.showFooter">
      <tr>
        <survey-matrixcell
          :cell="cell"
          :question="question"
          v-for="(cell, cellIndex) in table.footerRow.cells"
          :key="'footer_' + cellIndex"
        />
      </tr>
    </tfoot>
  </table>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { surveyCss } from "../defaultCss/cssstandard";
import { Question } from "../question";
import {
  QuestionMatrixDropdownModelBase,
  QuestionMatrixDropdownRenderedTable
} from "../question_matrixdropdownbase";

@Component
export class MatrixTable extends Vue {
  @Prop question: QuestionMatrixDropdownModelBase;
  get table(): QuestionMatrixDropdownRenderedTable {
    return this.question.renderedTable;
  }
}

Vue.component("survey-matrixtable", MatrixTable);
export default MatrixTable;
</script>
