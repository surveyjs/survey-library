<template>
  <div :style="{ overflowX: question.showHorizontalScroll ? 'scroll' : '' }" :class="question.cssClasses.tableWrapper">
    <table :class="question.getTableCss()">
      <thead v-if="table.showHeader">
        <tr>
          <template v-for="cell in table.headerRow.cells">
            <th
              v-if="cell.hasTitle"
              :class="cell.className"
              :key="'header_' + cell.id"
              :style="{ minWidth: cell.minWidth, width: cell.width }"
            >
              <survey-string :locString="cell.locTitle" />
              <survey-matrixheaderrequired v-if="!!cell.column" :column="cell.column" :question="question"></survey-matrixheaderrequired>
            </th>
            <td
              v-if="!cell.hasTitle"
              :class="cell.className"
              :key="'header_' + cell.id"
              :style="{ minWidth: cell.minWidth, width: cell.width }"
            ></td>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in table.rows">
          <tr
            v-if="row.visible"
            :data-sv-drop-target-matrix-row="row.row && row.row.id"
            :class="row.className"
            :key="question.inputId + '_' + row.id"
          >
          <survey-matrixdropdown-cell
            :cell="cell"
            :question="question"
            v-for="(cell, cellIndex) in row.cells"
            :key="row.id + '_' + cellIndex"
          />
        </tr>
        </template>
      </tbody>
      <tfoot v-if="table.showFooter">
        <tr>
          <survey-matrixdropdown-cell
            :cell="cell"
            :question="question"
            v-for="(cell, cellIndex) in table.footerRow.cells"
            :key="'footer_' + cellIndex"
          />
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question } from "survey-core";
import {
  QuestionMatrixDropdownModelBase,
  QuestionMatrixDropdownRenderedTable,
} from "survey-core";
import { BaseVue } from "./base";
import { Base } from "survey-core";

@Component
export class MatrixTable extends BaseVue {
  @Prop() question: QuestionMatrixDropdownModelBase;
  get table(): QuestionMatrixDropdownRenderedTable {
    return this.question.renderedTable;
  }
  protected getModel(): Base {
    return this.question.renderedTable;
  }
}

Vue.component("survey-matrixtable", MatrixTable);
export default MatrixTable;
</script>
