<template>
    <table :class="question.cssClasses.root">
        <thead v-if="showHeader">
            <tr>
                <td v-if="!isDynamic"></td>
                <th v-for="column in question.columns" :style="{ minWidth: question.getColumnWidth(column) }"><survey-string :locString="column.locTitle"/></th>
                <td v-if="question.canRemoveRow"></td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, rowIndex) in rows" :key="question.inputId + '_' + rowIndex">
                <td v-if="!isDynamic"><survey-string :locString="row.locText"/></td>
                <survey-matrixcell :question="question" :cell="cell" v-for="cell in row.cells" :key="rowIndex + '_' + cell.question.id"/>
                <td v-if="canRemoveRow">
                    <input type="button" :class="question.cssClasses.button + ' ' + question.cssClasses.buttonRemove" :value="question.removeRowText" @click="removeRowClick(row)" />
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
import { QuestionMatrixDropdownModelBase } from "../question_matrixdropdownbase";
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
  get showHeader() {
    return this.question.showHeader;
  }
  get isDynamic() {
    return this.question.isRowsDynamic;
  }
  get canRemoveRow() {
    return this.isDynamic && this.matrixDynamic.canRemoveRow;
  }
  removeRowClick(row) {
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
