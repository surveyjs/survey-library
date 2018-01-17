<template>
    <div :style="{overflowX: question.horizontalScroll? 'scroll': ''}">
        <table :class="question.cssClasses.root">
            <thead>
                <tr>
                    <th v-for="column in question.columns" :style="{ minWidth: question.getColumnWidth(column) }"><survey-string :locString="column.locTitle"/></th>
                    <td v-if="!question.isReadOnly"></td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows">
                    <survey-matrixcell :question="question" :cell="cell" v-for="cell in row.cells" />
                    <td v-if="!question.isReadOnly">
                        <input type="button" v-if="question.canRemoveRow" :class="question.cssClasses.button" :value="question.removeRowText" @click="removeRowClick(row)" />
                    </td>
                </tr>
            </tbody>
        </table>
        <div :class="question.cssClasses.footer">
            <input type="button" v-if="!question.isReadOnly && question.canAddRow" :class="question.cssClasses.button" :value="question.addRowText" @click="addRowClick"/>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as Question } from "./question";
import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import { MatrixDropdownRowModelBase } from "../question_matrixdropdownbase";

@Component
export default class MatrixDynamic extends Question<
  QuestionMatrixDynamicModel
> {
  get rows() {
    return this.question.visibleRows;
  }
  removeRowClick(row) {
    var rows = this.question.visibleRows;
    var index = rows.indexOf(row);
    if (index > -1) {
      this.question.removeRowUI(index);
    }
  }
  addRowClick() {
    this.question.addRow();
  }
}
Vue.component("survey-matrixdynamic", MatrixDynamic);
</script>
