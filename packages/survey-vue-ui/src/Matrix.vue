<template>
  <div :class="question.cssClasses.tableWrapper" ref="root">
    <fieldset>
      <legend v-bind:aria-label="question.locTitle.renderedHtml"></legend>
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
              <survey-string :locString="column.locText" />
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
              :class="question.cssClasses.rowTextCell"
              v-show="question.hasRows"
              :style="{
                minWidth: question.rowTitleWidth,
                width: question.rowTitleWidth,
              }"
            >
              <survey-string :locString="row.locText" />
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
                <label
                  @mousedown="question.onMouseDown()"
                  :class="question.getItemClass(row, column)"
                >
                  <input
                    type="radio"
                    :class="question.cssClasses.itemValue"
                    :name="row.fullName"
                    v-model="row.value"
                    :value="column.value"
                    :disabled="question.isInputReadOnly"
                    :id="question.inputId + '_' + row.name + '_' + columnIndex"
                    :aria-required="question.ariaRequired"
                    :aria-label="column.locText.renderedHtml"
                    :aria-invalid="question.ariaInvalid"
                    :aria-describedby="question.ariaDescribedBy"
                  />
                  <span :class="question.cssClasses.materialDecorator">
                    <svg
                      v-if="question.itemSvgIcon"
                      :class="question.cssClasses.itemDecorator"
                    >
                      <use :xlink:href="question.itemSvgIcon"></use>
                    </svg>
                  </span>
                  <span
                    v-show="question.isMobile"
                    :class="question.cssClasses.cellResponsiveTitle"
                  >
                    <survey-string :locString="column.locText"></survey-string>
                  </span>
                </label>
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
  if (props.question.isInputReadOnly) return;
  row.value = column.value;
};
</script>
