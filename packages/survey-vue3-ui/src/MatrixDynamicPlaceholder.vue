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
    <SvComponent v-if="!question.isDesignMode" :is="'sv-action-bar'" :model="question.toolbar"></SvComponent>
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