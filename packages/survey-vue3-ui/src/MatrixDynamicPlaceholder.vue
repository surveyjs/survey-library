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

defineProps<{
  question: QuestionMatrixDynamicModel;
}>();
</script> 