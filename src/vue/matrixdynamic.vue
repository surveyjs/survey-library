<template>
  <div :style="{ overflowX: question.horizontalScroll ? 'scroll' : '' }">
    <div
      v-if="question.renderedTable.showAddRowOnTop"
      :class="question.cssClasses.footer"
    >
      <button
        type="button"
        :class="
          question.cssClasses.button + ' ' + question.cssClasses.buttonAdd
        "
        @click="addRowClick"
      >
        <span>{{ question.addRowText }}</span>
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
        :class="
          question.cssClasses.button +
          ' ' +
          question.cssClasses.buttonAdd +
          ' ' +
          question.cssClasses.emptyRowsButton
        "
        @click="addRowClick"
      >
        <span>{{ question.addRowText }}</span>
        <span :class="question.cssClasses.iconAdd"></span>
      </button>
    </div>
    <div
      v-if="question.renderedTable.showAddRowOnBottom"
      :class="question.cssClasses.footer"
    >
      <button
        type="button"
        :class="
          question.cssClasses.button + ' ' + question.cssClasses.buttonAdd
        "
        @click="addRowClick"
      >
        <span>{{ question.addRowText }}</span>
        <span :class="question.cssClasses.iconAdd"></span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionMatrixDynamicModel } from "survey-core";
import { MatrixDropdownRowModelBase } from "survey-core";

@Component
export class MatrixDynamic extends QuestionVue<QuestionMatrixDynamicModel> {
  addRowClick() {
    this.question.addRow();
  }
}
Vue.component("survey-matrixdynamic", MatrixDynamic);
export default MatrixDynamic;
</script>
