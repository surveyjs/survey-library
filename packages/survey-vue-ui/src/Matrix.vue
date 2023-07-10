<template>
  <div :class="question.cssClasses.tableWrapper">
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
            <td :class="question.cssClasses.rowTextCell" v-show="question.hasRows"
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
              <label @mousedown="question.onMouseDown()" :class="question.getItemClass(row, column)">
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
                    <svg v-if="question.itemSvgIcon" :class="question.cssClasses.itemDecorator">
                      <use :xlink:href="question.itemSvgIcon"></use>
                    </svg>
                </span>
                <span v-show="question.isMobile" :class="question.cssClasses.cellResponsiveTitle">
                  <survey-string :locString="column.locText"></survey-string>
                </span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { QuestionMatrixModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "survey-matrix",
  props: {
    question: Object as PropType<QuestionMatrixModel>,
  },
  data: (vm: any) => {
    return {
      cellClick(row: any, column: any): void {
        if (vm.question.isInputReadOnly) return;
        row.value = column.value;
      },
    };
  },
});
</script>
