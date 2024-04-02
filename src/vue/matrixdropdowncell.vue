<template>
  <td
    :class="cell.className"
    :data-responsive-title="getHeaders()"
    :title="cell.getTitle()"
    :style="getCellStyle()"
    :colspan="cell.colSpans"
    v-on:focusin="cell.focusIn()"
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
    <div v-if="cell.hasQuestion" :class="cell.cellQuestionWrapperClassName">
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
        :question="cell.question"
        :item="cell.item"
        :hideLabel="true"
      ></survey-radiogroup-item>
      <survey-checkbox-item
        v-if="cell.isCheckbox"
        :key="cell.item.value"
        :question="cell.question"
        :item="cell.item"
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
export class MatrixDropdownCellComp extends Vue {
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
    const cQ = this.cell.question;
    const el: any = this.$el;
    const options = {
      cell: this.cell.cell,
      cellQuestion: cQ,
      htmlElement: el,
      row: this.cell.row,
      column: this.cell.cell.column,
    };
    this.question.survey.matrixAfterCellRender(this.question, options);
    if (cQ) {
      cQ.afterRenderCore(el);
    }
  }
  private onVisibilityChanged() {
    this.isVisible = this.cell.question.isVisible;
  }
}

Vue.component("survey-matrixdropdown-cell", MatrixDropdownCellComp);
export default MatrixDropdownCellComp;
</script>