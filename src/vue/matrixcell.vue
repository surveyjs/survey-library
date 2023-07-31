<template>
  <td
    :class="cell.className"
    :data-responsive-title="getHeaders()"
    :title="cell.getTitle()"
    :style="getCellStyle()"
    :colspan="cell.colSpans"
  >
    <survey-errors
      v-if="cell.isErrorsCell"
      :element="cell.question"
    />
    <sv-action-bar
      v-if="cell.isActionsCell"
      :model="cell.item.getData()"
      :handleClick="false"
    ></sv-action-bar>
    <component
      v-if="cell.hasPanel"
      :is="getComponentName(cell.panel)"
      :question="cell.panel"
      :css="question.cssClasses"
    ></component>
    <div v-if="cell.hasQuestion" :class="question.cssClasses.cellQuestionWrapper">
      <component
        v-if="!cell.isChoice && cell.question.isDefaultRendering()"
        v-show="isVisible"
        :is="getComponentName(cell.question)"
        :question="cell.question"
      />
      <component
        v-if="!cell.isChoice && !cell.question.isDefaultRendering()"
        v-show="isVisible"
        :is="cell.question.getComponentName()"
        :question="cell.question"
      />
      <survey-radiogroup-item
        v-if="cell.isRadio"
        :key="cell.item.value"
        :class="cell.question.getItemClass(cell.item)"
        :question="cell.question"
        :item="cell.item"
        :index="getCellIndex()"
        :hideLabel="true"
      ></survey-radiogroup-item>
      <survey-checkbox-item
        v-if="cell.isCheckbox"
        :key="cell.item.value"
        :class="cell.question.getItemClass(cell.item)"
        :question="cell.question"
        :item="cell.item"
        :index="getCellIndex()"
        :hideLabel="true"
      ></survey-checkbox-item>
      <survey-other-choice
        v-if="cell.isOtherChoice"
        :question="cell.question"
      />
    </div>
    <survey-string v-if="cell.hasTitle" :locString="cell.locTitle" />
    <span v-if="!!cell.requiredText" :class="question.cssClasses.cellRequiredText">{{ cell.requiredText }}</span>
  </td>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import {
  Question,
  QuestionMatrixDropdownRenderedCell,
  CssClassBuilder,
} from "survey-core";
import { getComponentName } from "./question";

@Component
export class MatrixCell extends Vue {
  @Prop() question: Question;
  @Prop() cell: QuestionMatrixDropdownRenderedCell;

  isVisible: boolean = false;
  getComponentName(element: Question | any) {
    return getComponentName(element);
  }
  getHeaders(): string {
    return this.cell.headers;
  }
  getCellStyle() {
    if (!!this.cell.width || !!this.cell.minWidth)
      return { width: this.cell.width, minWidth: this.cell.minWidth };
    return null;
  }
  getCellIndex(): string {
    return (this.cell as any).index || "";
  }
  mounted() {
    if (!this.cell.hasQuestion || !this.question || !this.question.survey) return;
    this.onVisibilityChanged();
    this.cell.question.registerPropertyChangedHandlers(["isVisible"], () => {
      this.onVisibilityChanged();
    });
    var options = {
      cell: this.cell.cell,
      cellQuestion: this.cell.question,
      htmlElement: this.$el,
      row: this.cell.row,
      column: this.cell.cell.column,
    };
    this.question.survey.matrixAfterCellRender(this.question, options);
  }
  private onVisibilityChanged() {
    this.isVisible = this.cell.question.isVisible;
  }
}

Vue.component("survey-matrixcell", MatrixCell);
export default MatrixCell;
</script>
