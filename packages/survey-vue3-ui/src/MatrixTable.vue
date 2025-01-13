<template>
  <div
    :style="{ overflowX: question.showHorizontalScroll ? 'scroll' : '' as any }"
    :class="question.cssClasses.tableWrapper"
  >
    <table :class="question.getTableCss()">
      <thead v-if="table.showHeader">
        <tr>
          <template v-for="cell in table.headerRow.cells">
            <th
              v-if="cell.hasTitle"
              :key="'header_' + cell.id"
              :class="cell.className"
              :style="{ minWidth: cell.minWidth, width: cell.width }"
            >
              <SvComponent
                :is="question.getColumnHeaderWrapperComponentName(cell as any)"
                :componentData="question.getColumnHeaderWrapperComponentData(cell as any)"
              >
                <SvComponent :is="'survey-string'" :locString="cell.locTitle" />
                <SvComponent
                  :is="'survey-matrixheaderrequired'"
                  v-if="!!cell.column"
                  :column="cell.column"
                  :question="question"
                ></SvComponent>
              </SvComponent>
            </th>
            <td
              v-if="!cell.hasTitle"
              :class="cell.className"
              :key="'header_' + cell.id"
              :style="{ minWidth: cell.minWidth, width: cell.width }"
            ></td>
          </template>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="row in table.renderedRows"
          :key="question.inputId + '_' + row.id"
        >
          <SvComponent
            :is="'survey-matrix-row'"
            :row="row"
            :question="question"
          ></SvComponent>
        </template>
      </tbody>
      <tfoot v-if="table.showFooter">
        <tr>
          <SvComponent
            :is="'survey-matrixdropdown-cell'"
            :cell="cell"
            :question="question"
            v-for="(cell, cellIndex) in table.footerRow.cells"
            :key="'footer_' + cellIndex"
          />
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionMatrixDropdownModelBase } from "survey-core";
import { computed } from "vue";
import { useBase } from "./base";

const props = defineProps<{ question: QuestionMatrixDropdownModelBase }>();
const table = computed(() => {
  return props.question.renderedTable;
});
useBase(() => table.value);
</script>
