<template>
    <div :style="{overflowX: question.horizontalScroll? 'scroll': ''}">
        <table :class="question.cssClasses.root">
            <thead>
                <tr>
                    <td></td>
                    <th v-for="column in question.columns" :style="{ minWidth: question.getColumnWidth(column) }"><survey-string :locString="column.locTitle"/></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows">
                    <td><survey-string :locString="row.locText"/></td>
                    <survey-matrixcell :question="question" :cell="cell" v-for="cell in row.cells" />
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as Question } from "./question";
import { QuestionMatrixDropdownModel } from "../question_matrixdropdown";
import { MatrixDropdownRowModelBase } from "../question_matrixdropdownbase";

@Component
export default class MatrixDropdown extends Question<
  QuestionMatrixDropdownModel
> {
  get rows() {
    return this.question.visibleRows;
  }
}

Vue.component("survey-matrixdropdown", MatrixDropdown);
</script>
