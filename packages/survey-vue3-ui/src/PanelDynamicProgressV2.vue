<template>
  <div :class="question.cssClasses.footer" v-if="!!question.cssClasses.footer">
    <hr :class="question.cssClasses.separator" />
    <div
      :class="question.cssClasses.progress"
      v-if="question.isRangeShowing && question.isProgressBottomShowing"
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
      v-if="question.showFooterToolbar"
    >
      <SvComponent :is="'sv-action-bar'" :model="question.footerToolbar" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionPanelDynamicModel } from "survey-core";
defineProps<{
  question: QuestionPanelDynamicModel;
}>();
</script>
