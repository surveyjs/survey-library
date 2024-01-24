<template>
  <div :class="question.cssClasses.tableWrapper" ref="root">
    <fieldset>
      <legend class="sv-hidden">{{ question.locTitle.renderedHtml }}</legend>
      <table :class="question.getTableCss()">
        <thead v-if="question.showHeader">
          <tr>
            <td v-if="question.hasRows"></td>
            <th
              v-for="(column, columnIndex) in question.visibleColumns"
              :key="columnIndex"
              :class="question.cssClasses.headerCell"
              :style="{
                minWidth: question.columnMinWidth,
                width: question.columnMinWidth,
              }"
            >
              <component
                :is="question.getColumnHeaderWrapperComponentName(column)"
                :componentData="
                  question.getColumnHeaderWrapperComponentData(column)
                "
              >
                <survey-string :locString="column.locText" />
              </component>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in visibleRows"
            :key="'row_' + row.name + '_' + rowIndex"
            :class="row.rowClasses || undefined"
          >
            <td
              :class="row.rowTextClasses"
              v-show="question.hasRows"
              :style="{
                minWidth: question.rowTitleWidth,
                width: question.rowTitleWidth,
              }"
            >
              <component
                :is="question.getRowHeaderWrapperComponentName(row)"
                :componentData="question.getRowHeaderWrapperComponentData(row)"
              >
                <survey-string :locString="row.locText" />
              </component>
            </td>
            <template v-if="question.hasCellText">
              <td
                v-for="(column, columnIndex) in question.visibleColumns"
                :key="columnIndex"
                :class="question.getItemClass(row, column)"
                v-on:click="cellClick(row, column)"
              >
                <survey-string
                  :locString="question.getCellDisplayLocText(row.name, column)"
                ></survey-string>
              </td>
            </template>
            <template v-if="!question.hasCellText">
              <td
                v-for="(column, columnIndex) in question.visibleColumns"
                :key="columnIndex"
                :data-responsive-title="column.locText.renderedHtml"
                :class="question.cssClasses.cell"
                v-on:click="cellClick(row, column)"
              >
                <component
                  :is="question.cellComponent"
                  :question="question"
                  :row="row"
                  :column="column"
                  :columnIndex="columnIndex"
                ></component>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </fieldset>
  </div>
</template>

<script lang="ts" setup>
import type { QuestionMatrixModel } from "survey-core";
import { useQuestion } from "./base";
import { ref, shallowRef } from "vue";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{ question: QuestionMatrixModel }>();
const root = ref(null);
const visibleRows = shallowRef();
useQuestion<QuestionMatrixModel>(
  props,
  root,
  (value) => {
    visibleRows.value = value.visibleRows;
    value.visibleRowsChangedCallback = () => {
      visibleRows.value = value.visibleRows;
    };
  },
  (value) => {
    value.visibleRowsChangedCallback = () => {};
  }
);

const cellClick = (row: any, column: any) => {
  row.value = column.value;
};
</script>
