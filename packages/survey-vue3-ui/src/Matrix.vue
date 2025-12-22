<template>
  <div :class="question.getTableWrapperCss()" ref="root">
    <fieldset role="radiogroup">
      <legend class="sv-visuallyhidden">{{ question.locTitle.renderedHtml }}</legend>
      <table :class="question.getTableCss()" role="presentation">
        <thead v-if="question.showHeader" role="presentation">
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
              <SvComponent
                :is="question.getColumnHeaderWrapperComponentName(column)"
                :componentData="
                  question.getColumnHeaderWrapperComponentData(column)
                "
              >
                <SvComponent
                  :is="'survey-string'"
                  :locString="column.locText"
                />
              </SvComponent>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row) in visibleRows" :key="row.uniqueId">
            <SvComponent :is="'sv-matrix-row'" :question="question" :row="row"/>
          </template>
        </tbody>
      </table>
    </fieldset>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { MatrixRowModel, type QuestionMatrixModel } from "survey-core";
import { useQuestion } from "./base";
import { ref, shallowRef } from "vue";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{ question: QuestionMatrixModel }>();
const root = ref(null);
const visibleRows = shallowRef<Array<MatrixRowModel>>();
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
</script>
