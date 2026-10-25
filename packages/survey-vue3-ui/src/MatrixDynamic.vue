<template>
  <div ref="root">
    <SvComponent v-if="question.getShowToolbar('top')" :is="'sv-action-bar'" :model="question.toolbar"></SvComponent>
    <div v-if="question.sortBarLocation === 'top'" :class="question.cssClasses.sortBarTop">
      <SvComponent :is="'sv-action-bar'" :model="question.recordsBar.sortActions"></SvComponent>
    </div> master
    <SvComponent
      :is="'survey-matrixtable'"
      v-if="question.renderedTable.showTable"
      :question="question"
    />
    <SvComponent
      :is="'survey-placeholder-matrixdynamic'"
      v-else
      :question="question"
    />
    <div v-if="question.showPager || question.getShowToolbar('bottom')" :class="question.cssClasses.footerBar">
      <SvComponent v-if="question.getShowToolbar('bottom')" :is="'sv-action-bar'" :model="question.toolbar"></SvComponent>
      <SvComponent v-if="question.showPager" :is="'sv-action-bar'" :model="question.recordsBar.pagerActions"></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { QuestionMatrixDynamicModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
import SvComponent from "@/SvComponent.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionMatrixDynamicModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
