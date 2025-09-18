<template>
  <tr :class="row.rowClasses || undefined">
    <td
      :class="row.rowTextClasses"
      v-show="question.hasRows"
      :style="{
        minWidth: question.rowTitleWidth,
        width: question.rowTitleWidth,
      }"
    >
      <SvComponent
        :is="question.getRowHeaderWrapperComponentName(row as any)"
        :componentData="question.getRowHeaderWrapperComponentData(row as any)"
      >
        <SvComponent :is="'survey-string'" :locString="row.locText" />
      </SvComponent>
    </td>
    <template v-if="question.hasCellText">
      <td
        v-for="(column, columnIndex) in question.visibleColumns"
        :key="columnIndex"
        :class="question.getItemClass(row, column)"
        v-on:click="cellClick(row, column)"
      >
        <SvComponent
          :is="'survey-string'"
          :locString="question.getCellDisplayLocText(row.name, column)"
        ></SvComponent>
      </td>
    </template>
    <template v-if="!question.hasCellText">
      <td
        v-for="(column, columnIndex) in question.visibleColumns"
        :key="columnIndex"
        :data-responsive-title="column.locText.renderedHtml"
        :class="question.cssClasses.cell"
      >
        <SvComponent
          :is="question.cellComponent"
          :question="question"
          :row="row"
          :column="column"
          :columnIndex="columnIndex"
        ></SvComponent>
      </td>
    </template>
  </tr>
</template>

<script setup lang="ts">
import SvComponent from "./SvComponent.vue";
import type { MatrixRowModel, QuestionMatrixModel } from "survey-core";
import { useBase } from "./base";
const props = defineProps<{
  question: QuestionMatrixModel;
  row: MatrixRowModel;
}>();
useBase(() => props.row);
useBase(() => props.row.item);
const cellClick = (row: any, column: any) => {
  row.cellClick(column);
};
</script>
