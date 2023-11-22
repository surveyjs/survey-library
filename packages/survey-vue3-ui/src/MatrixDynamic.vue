<template>
  <div ref="root">
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
        v-if="question.renderedTable.showAddRow"
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

<script lang="ts" setup>
import type { QuestionMatrixDynamicModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionMatrixDynamicModel }>();
const root = ref(null);
useQuestion(props, root);
const addRowClick = () => {
  props.question.addRowUI();
};
</script>
