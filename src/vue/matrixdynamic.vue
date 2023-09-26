<template>
  <div>
    <div
      v-if="question.renderedTable.showAddRowOnTop"
      :class="question.cssClasses.footer"
    >
      <button
        type="button"
        :class="question.getAddRowButtonCss()"
        @click="addRowClick"
      >
        <survey-string :locString="question.locAddRowText" />
        <span :class="question.cssClasses.iconAdd"></span>
      </button>
    </div>
    <survey-matrixtable
      v-if="question.renderedTable.showTable"
      :question="question"
    />
    <div
      v-if="!question.renderedTable.showTable"
      :class="question.cssClasses.emptyRowsSection"
    >
      <div :class="question.cssClasses.emptyRowsText">
        <survey-string :locString="question.locEmptyRowsText" />
      </div>
      <button
        type="button"
        v-if="question.renderedTable.showAddRow"
        :class="question.getAddRowButtonCss(true)"
        @click="addRowClick"
      >
        <survey-string :locString="question.locAddRowText" />
        <span :class="question.cssClasses.iconAdd"></span>
      </button>
    </div>
    <div
      v-if="question.renderedTable.showAddRowOnBottom"
      :class="question.cssClasses.footer"
    >
      <button
        type="button"
        :class="question.getAddRowButtonCss()"
        @click="addRowClick"
      >
        <survey-string :locString="question.locAddRowText" />
        <span :class="question.cssClasses.iconAdd"></span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionMatrixDynamicModel } from "survey-core";

@Component
export class MatrixDynamic extends QuestionVue<QuestionMatrixDynamicModel> {
  addRowClick() {
    this.question.addRowUI();
  }
}
Vue.component("survey-matrixdynamic", MatrixDynamic);
export default MatrixDynamic;
</script>
