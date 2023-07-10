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
import { QuestionMatrixDynamicModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "survey-matrixdynamic",
  props: {
    question: Object as PropType<QuestionMatrixDynamicModel>,
  },
  data: (vm: any) => {
    return {
      addRowClick(): void {
        vm.question.addRowUI();
      },
    };
  },
});
</script>
