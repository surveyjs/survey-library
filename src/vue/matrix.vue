<template>
  <div :class="question.cssClasses.tableWrapper">
    <fieldset>
      <legend class="sv-hidden">{{question.locTitle.renderedHtml}}</legend>
      <table :class="question.getTableCss()">
        <thead v-if="question.showHeader">
          <tr>
            <td v-if="question.hasRows"></td>
            <th
              v-for="(column, columnIndex) in question.visibleColumns"
              :key="columnIndex"
              :class="question.cssClasses.headerCell"
              :style="{minWidth: question.columnMinWidth, width: question.columnMinWidth}"
            >
              <survey-string :locString="column.locText" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in question.visibleRows"
            :key="'row_' + row.name + '_' + rowIndex"
            :class="row.rowClasses || undefined"
          >
            <td :class="row.rowTextClasses" v-show="question.hasRows"
              :style="{minWidth: question.rowTitleWidth, width: question.rowTitleWidth}">
              <survey-string :locString="row.locText" />
            </td>
            <td
              v-if="question.hasCellText"
              v-for="(column, columnIndex) in question.visibleColumns"
              :key="columnIndex"
              :class="question.getItemClass(row, column)"
              v-on:click="cellClick(row, column)"
            >
              <survey-string
                :locString="question.getCellDisplayLocText(row.name, column)"
              ></survey-string>
            </td>
            <td
              v-if="!question.hasCellText"
              v-for="(column, columnIndex) in question.visibleColumns"
              :key="columnIndex"
              :data-responsive-title="column.locText.renderedHtml"
              :class="question.cssClasses.cell"
              v-on:click="cellClick(row, column)"
            >
<component :is="question.cellComponent" :question="question" :row="row" :column="column" :columnIndex="columnIndex"></component>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionMatrixModel } from "survey-core";

@Component
export class Matrix extends QuestionVue<QuestionMatrixModel> {
  cellClick(row: any, column: any) {
    row.value = column.value;
  }
}
Vue.component("survey-matrix", Matrix);
export default Matrix;
</script>