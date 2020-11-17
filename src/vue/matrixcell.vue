<template>
  <td
    :class="cell.className"
    :headers="getHeaders()"
    :style="getCellStyle()"
    :colspan="cell.colSpans"
  >
    <button
      v-if="cell.isShowHideDetail"
      type="button"
      :class="question.cssClasses.detailButton"
      @click="showHideDetailPanelClick()"
    >
      <span :class="question.getDetailPanelButtonCss(cell.row)"></span>
    </button>
    <component
      v-if="cell.hasPanel"
      :is="getComponentName(cell.panel)"
      :question="cell.panel"
      :css="question.survey.css"
    ></component>
    <div v-if="cell.hasQuestion">
      <survey-errors
        v-if="hasErrorsOnTop"
        :question="cell.question"
        :location="'top'"
      />
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
        v-if="cell.isChoice && !cell.isCheckbox"
        :key="cell.item.value"
        :class="getItemClass(cell.item)"
        :question="cell.question"
        :item="cell.item"
        :index="'' + cell.index"
        :hideLabel="true"
      ></survey-radiogroup-item>
      <survey-checkbox-item
        v-if="cell.isChoice && cell.isCheckbox"
        :key="cell.item.value"
        :class="getItemClass(cell.item)"
        :question="cell.question"
        :item="cell.item"
        :index="'' + cell.index"
        :hideLabel="true"
      ></survey-checkbox-item>
      <survey-errors
        v-if="hasErrorsOnBottom"
        :question="cell.question"
        :location="'bottom'"
      />
    </div>
    <button
      v-if="cell.isRemoveRow"
      type="button"
      :class="
        question.cssClasses.button + ' ' + question.cssClasses.buttonRemove
      "
      @click="removeRowClick()"
    >
      <span>{{ question.removeRowText }}</span>
      <span :class="question.cssClasses.iconRemove"></span>
    </button>
    <survey-string v-if="cell.hasTitle" :locString="cell.locTitle" />
    <span v-if="!!cell.requiredText">{{ cell.requiredText }}</span>
  </td>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question } from "../question";
import {
  MatrixDropdownCell,
  QuestionMatrixDropdownRenderedCell,
} from "../question_matrixdropdownbase";

@Component
export class MatrixCell extends Vue {
  @Prop question: Question;
  @Prop cell: QuestionMatrixDropdownRenderedCell;

  isVisible: boolean = false;
  getComponentName(element: Question) {
    if (element.customWidget) {
      return "survey-customwidget";
    }
    return "survey-" + element.getType();
  }
  get hasErrorsOnTop() {
    return this.cell.showErrorOnTop;
  }
  get hasErrorsOnBottom() {
    return this.cell.showErrorOnBottom;
  }
  getHeaders() {
    var element = this.cell.question;
    if (!element) return "";
    return element.isVisible ? this.cell.cell.column.locTitle.renderedHtml : "";
  }
  getCellStyle() {
    if (this.cell.isChoice) return { "text-align": "center" };
    if (!!this.cell.width || !!this.cell.minWidth)
      return { width: this.cell.width, minWidth: this.cell.minWidth };
    return null;
  }
  getItemClass(item: any) {
    var cssClasses = this.cell.question.cssClasses;
    var isDisabled = this.cell.question.isReadOnly || !item.isEnabled;
    var isChecked = item.value === this.cell.question.renderedValue;
    var allowHover = !isDisabled && !isChecked;
    var itemClass = this.cell.question.cssClasses.item;
    if (isDisabled) itemClass += " " + cssClasses.itemDisabled;
    if (isChecked) itemClass += " " + cssClasses.itemChecked;
    if (allowHover) itemClass += " " + cssClasses.itemHover;
    return itemClass;
  }
  removeRowClick() {
    this.question.removeRowUI(this.cell.row);
  }
  showHideDetailPanelClick() {
    this.cell.row.showHideDetailPanelClick();
  }
  mounted() {
    if (!this.cell.hasQuestion || !this.question || !this.question.survey)
      return;
    this.onVisibilityChanged();
    var self = this;
    this.cell.question.registerFunctionOnPropertyValueChanged(
      "isVisible",
      function () {
        self.onVisibilityChanged();
      }
    );
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
