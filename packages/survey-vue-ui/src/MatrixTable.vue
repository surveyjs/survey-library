<template>
  <div :style="{ overflowX: question.showHorizontalScroll ? 'scroll' : '' }" :class="question.cssClasses.tableWrapper">
    <table :class="question.getTableCss()">
      <thead v-if="table.showHeader">
        <tr>
          <template v-for="cell in table.headerRow.cells">
            <th
              v-if="cell.hasTitle"
              :class="cell.className"
              :key="'header_' + cell.id"
              :style="{ minWidth: cell.minWidth, width: cell.width }"
            >
              <survey-string :locString="cell.locTitle" />
              <survey-matrixheaderrequired v-if="!!cell.column" :column="cell.column" :question="question"></survey-matrixheaderrequired>
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
        <tr
          v-for="row in table.rows"
          :data-sv-drop-target-matrix-row="row.row && row.row.id"
          :class="row.className"
          :key="question.inputId + '_' + row.id"
        >
          <survey-matrixcell
            :cell="cell"
            :question="question"
            v-for="(cell, cellIndex) in row.cells"
            :key="row.id + '_' + cellIndex"
          />
        </tr>
      </tbody>
      <tfoot v-if="table.showFooter">
        <tr>
          <survey-matrixcell
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

<script lang="ts">
import { QuestionMatrixDropdownModelBase, QuestionMatrixDropdownRenderedTable } from "survey-core";
import { BaseVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [BaseVue],
  name: "survey-matrixtable",
  props: {
    question: { type: Object as PropType<QuestionMatrixDropdownModelBase>, required: true },
  },
  methods: {
    getModel(): QuestionMatrixDropdownRenderedTable {
      return this.question.renderedTable;
    },
  },
  computed: {
    // readonly
    table(): QuestionMatrixDropdownRenderedTable {
      return this.question.renderedTable;
    },
  },
});
</script>
