<template>
  <table :class="question.cssClasses.root">
    <thead v-if="showHorizontalHeader">
      <tr>
        <td v-if="!isDynamic"></td>
        <th
          v-for="column in question.visibleColumns"
          :style="{ minWidth: question.getColumnWidth(column) }"
        >
          <survey-string :locString="column.locTitle"/>
        </th>
        <td v-if="question.canRemoveRow"></td>
      </tr>
    </thead>
    <thead v-if="showVerticalHeader">
      <tr>
        <td v-if="this.question.showHeader"></td>
        <th v-for="row in rows">
          <survey-string :locString="row.locText"/>
        </th>
      </tr>
    </thead>
    <tbody v-if="isColumnsHorizontal">
      <tr v-for="(row, rowIndex) in rows" :key="question.inputId + '_' + rowIndex">
        <td v-if="!isDynamic">
          <survey-string :locString="row.locText"/>
        </td>
        <survey-matrixcell
          :question="question"
          :cell="cell"
          v-for="cell in row.cells"
          :key="rowIndex + '_' + cell.question.id"
        />
        <td v-if="canRemoveRow">
          <button
            type="button"
            :class="question.cssClasses.button + ' ' + question.cssClasses.buttonRemove"
            @click="removeRowClick(row)"
          >
            <span>{{question.removeRowText}}</span>
            <span :class="question.cssClasses.iconRemove"></span>
          </button>
        </td>
      </tr>
    </tbody>
    <tbody v-if="!isColumnsHorizontal">
      <tr
        v-for="(column, columnIndex) in question.visibleColumns"
        :key="question.inputId + '_' + columnIndex"
      >
        <th v-if="question.showHeader">
          <survey-string :locString="column.locTitle"/>
        </th>
        <survey-matrixcell
          :question="question"
          :cell="cell"
          v-for="cell in getCellsByColumn(columnIndex)"
          :key="columnIndex + '_' + cell.question.id"
        />
      </tr>
      <tr v-if="canRemoveRow">
        <td v-if="question.showHeader"></td>
        <td v-for="(row, rowIndex) in rows" :key="'removeRow' + rowIndex">
          <button
            type="button"
            :class="question.cssClasses.button + ' ' + question.cssClasses.buttonRemove"
            @click="removeRowClick(row)"
          >
            <span>{{question.removeRowText}}</span>
            <span :class="question.cssClasses.iconRemove"></span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { surveyCss } from "../defaultCss/cssstandard";
import { Question } from "../question";
import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownCell,
  MatrixDropdownRowModelBase
} from "../question_matrixdropdownbase";
import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import { MatrixDropdownRowModel } from "../question_matrixdropdown";

@Component
export class MatrixTable extends Vue {
  @Prop question: QuestionMatrixDropdownModelBase;
  get matrixDynamic(): QuestionMatrixDynamicModel {
    return <QuestionMatrixDynamicModel>this.question;
  }
  get rows() {
    return this.question.visibleRows;
  }
  get isColumnsHorizontal() {
    return this.question.isColumnLayoutHorizontal;
  }
  get showHorizontalHeader() {
    return this.isColumnsHorizontal && this.question.showHeader;
  }
  get showVerticalHeader() {
    return !this.isColumnsHorizontal && !this.isDynamic;
  }
  get isDynamic() {
    return this.question.isRowsDynamic;
  }
  get canRemoveRow() {
    return this.isDynamic && this.matrixDynamic.canRemoveRow;
  }
  getCellsByColumn(columnIndex: number): Array<MatrixDropdownCell> {
    var res = [];
    var rows = this.rows;
    for (var i = 0; i < rows.length; i++) {
      res.push(rows[i].cells[columnIndex]);
    }
    return res;
  }
  removeRowClick(row: any) {
    var rows = this.question.visibleRows;
    var index = rows.indexOf(row);
    if (index > -1) {
      this.matrixDynamic.removeRowUI(index);
    }
  }
}

Vue.component("survey-matrixtable", MatrixTable);
export default MatrixTable;
</script>
