<template>
  <td
    :class="cell.className"
    :data-responsive-title="getHeaders()"
    :title="cell.getTitle()"
    :style="getCellStyle()"
    :colspan="cell.colSpans"
  >
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
      <survey-errors v-if="cell.showErrorOnTop" :element="cell.question" :location="'top'" />
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
      <survey-errors
        v-if="cell.showErrorOnBottom"
        :element="cell.question"
        :location="'bottom'"
      />
      <survey-errors
        v-if="cell.question.isErrorsModeTooltip"
        :element="cell.question"
        :location="'tooltip'"
      />
    </div>
    <survey-string v-if="cell.hasTitle" :locString="cell.locTitle" />
    <span v-if="!!cell.requiredText" :class="question.cssClasses.cellRequiredText">{{ cell.requiredText }}</span>
  </td>
</template>

<script lang="ts">
import { Question, QuestionMatrixDropdownRenderedCell, CssClassBuilder } from "survey-core";
import { QuestionVue, getComponentName } from "./base";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "survey-matrixcell",
  props: {
    question: Question,
    cell: QuestionMatrixDropdownRenderedCell,
  },
  data: (vm: any) => {
    return {
      isVisible: false,
      getComponentName(element: Question | any) {
        return getComponentName(element);
      },
      getHeaders(): string {
        return vm.cell.headers;
      },
      getCellStyle(): any {
        if (!!vm.cell.width || !!vm.cell.minWidth)
          return { width: vm.cell.width, minWidth: vm.cell.minWidth };
        return null;
      },
      getCellIndex(): string {
        return (vm.cell as any).index || "";
      },
      onVisibilityChanged: () => {
        vm.isVisible = vm.cell.question.isVisible;
      },
    };
  },

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
});
</script>
