<template>
  <div
    :class="question.cssClasses.noRowsSection"
  >
    <div :class="question.cssClasses.noRowsText">
      <SvComponent
        :is="'survey-string'"
        :locString="question.locNoRowsText"
      />
    </div>
    <button
      v-if="question.renderedTable.showAddRow"
      type="button"
      :class="question.getAddRowButtonCss(true)"
      @click="addRowClick"
    >
      <SvComponent
        :is="'survey-string'"
        :locString="question.locAddRowText"
      />
      <span :class="question.cssClasses.iconAdd"></span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionMatrixDynamicModel } from "survey-core";

const props = defineProps<{
  question: QuestionMatrixDynamicModel;
}>();

const addRowClick = () => {
  props.question.addRowUI();
};
</script> 