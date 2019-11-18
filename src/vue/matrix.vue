<template>
  <div :class="question.cssClasses.tableWrapper">
    <fieldset>
      <legend v-bind:aria-label="question.locTitle.renderedHtml"></legend>
      <table :class="question.cssClasses.root">
        <thead v-if="question.showHeader">
          <tr>
            <td v-show="question.hasRows"></td>
            <th v-for="column in question.visibleColumns" :class="question.cssClasses.headerCell">
              <survey-string :locString="column.locText" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in question.visibleRows" :class="question.cssClasses.row">
            <td :class="question.cssClasses.cell" v-show="question.hasRows">
              <survey-string :locString="row.locText" />
            </td>
            <td
              v-if="question.hasCellText"
              v-for="(column, columnIndex) in question.visibleColumns"
              :class="getItemClass(row, column) + ' ' + question.cssClasses.cell"
              v-on:click="function() { cellClick(row, column); }"
            >
              <span>{{question.getCellDisplayLocText(row.name, column).renderedHtml}}</span>
            </td>
            <td
              v-if="!question.hasCellText"
              v-for="(column, columnIndex) in question.visibleColumns"
              :headers="column.locText.renderedHtml"
              :class="question.cssClasses.cell"
              v-on:click="function() { cellClick(row, column); }"
            >
              <label :class="getItemClass(row, column)">
                <input
                  type="radio"
                  :class="question.cssClasses.itemValue"
                  :name="row.fullName"
                  v-model="row.value"
                  :value="column.value"
                  :disabled="question.isReadOnly"
                  :id="question.inputId + '_' + row.name + '_' + columnIndex"
                  v-bind:aria-required="question.isRequired"
                  :aria-label="question.locTitle.renderedHtml"
                />
                <span :class="question.cssClasses.materialDecorator">
                  <svg :class="question.cssClasses.itemDecorator" viewBox="-12 -12 24 24">
                    <circle r="6" cx="0" cy="0" />
                  </svg>
                </span>
                <span class="circle"></span>
                <span class="check"></span>
                <span :style="{ 'display': 'none' }">{{question.locTitle.renderedHtml}}</span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionMatrixModel } from "../question_matrix";

@Component
export class Matrix extends QuestionVue<QuestionMatrixModel> {
  getItemClass(row: any, column: any) {
    var question = this.question;
    var cssClasses = this.question.cssClasses;
    var isChecked = row.value == column.value;
    var isDisabled = question.isReadOnly;
    var allowHover = !isChecked && !isDisabled;
    var cellDisabledClass = question.hasCellText
      ? cssClasses.cellTextDisabled
      : cssClasses.itemDisabled;

    var cellSelectedClass = question.hasCellText
      ? cssClasses.cellTextSelected
      : cssClasses.itemChecked;

    var itemHoverClass = !question.hasCellText ? cssClasses.itemHover : "";

    var cellClass = question.hasCellText
      ? cssClasses.cellText
      : cssClasses.label;

    let itemClass =
      cellClass +
      (isChecked ? " " + cellSelectedClass : "") +
      (isDisabled ? " " + cellDisabledClass : "") +
      (allowHover ? " " + itemHoverClass : "");
    return itemClass;
  }
  cellClick(row: any, column: any) {
    if (this.question.isReadOnly) return;
    row.value = column.value;
  }
}
Vue.component("survey-matrix", Matrix);
export default Matrix;
</script>
