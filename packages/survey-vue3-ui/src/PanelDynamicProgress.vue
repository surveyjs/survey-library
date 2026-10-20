<template>
  <div :class="question.getFooterCss()" v-if="question.showFooter">
    <hr :class="question.cssClasses.separator" />
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
    <div
      :class="question.cssClasses.footerButtonsContainer"
      v-if="question.showFooterButtons"
    >
      <SvComponent :is="'sv-action-bar'" :model="question.footerToolbar" />
    </div>
    <SvComponent :is="'sv-records-bar'" :model="question.recordsBar"></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionPanelDynamicModel } from "survey-core";
defineProps<{
  question: QuestionPanelDynamicModel;
}>();
</script>
