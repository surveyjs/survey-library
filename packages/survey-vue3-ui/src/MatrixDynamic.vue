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
        <SvComponent
          :is="'survey-string'"
          :locString="question.locAddRowText"
        />
        <span :class="question.cssClasses.iconAdd"></span>
      </button>
    </div>
    <SvComponent
      :is="'survey-matrixtable'"
      v-if="question.renderedTable.showTable"
      :question="question"
    />
    <div
      v-if="!question.renderedTable.showTable"
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
    <div
      v-if="question.renderedTable.showAddRowOnBottom"
      :class="question.cssClasses.footer"
    >
      <button
        type="button"
        :class="question.getAddRowButtonCss()"
        @click="addRowClick"
      >
        <SvComponent
          :is="'survey-string'"
          :locString="question.locAddRowText"
        />
        <span :class="question.cssClasses.iconAdd"></span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
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
