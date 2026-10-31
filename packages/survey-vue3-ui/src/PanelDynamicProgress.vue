<template>
  <div :class="question.cssClasses.footerBar" v-if="question.showFooter">
    <div
      :class="question.cssClasses.progress"
      v-if="question.showFooterProgress"
    >
      <div
        :class="question.cssClasses.progressBar"
        :style="{ width: question.progress }"
        role="progressbar"
        :aria-label="question.progressBarAriaLabel"
      ></div>
    </div>
    <SvComponent v-if="question.showFooterButtons" :is="'sv-action-bar'" :model="question.footerToolbar" />
    <SvComponent v-if="question.showPager" :is="'sv-action-bar'" :model="question.recordsBar.pagerActions"></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionPanelDynamicModel } from "survey-core";
defineProps<{
  question: QuestionPanelDynamicModel;
}>();
</script>
