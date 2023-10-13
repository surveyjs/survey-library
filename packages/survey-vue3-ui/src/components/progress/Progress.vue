<template>
  <div :class="survey.getProgressCssClasses(container)">
    <div
      :class="survey.css.progressBar"
      :style="{ width: progress }"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="progress"
    >
      <span :class="getProgressTextInBarCss(survey.css)">{{
        survey.progressText
      }}</span>
    </div>
    <span :class="getProgressTextUnderBarCss(survey.css)">{{
      survey.progressText
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { SurveyModel, SurveyProgressModel } from "survey-core";

const props = defineProps<{
  survey: SurveyModel;
  container?: string;
  css?: any;
}>();
const progress = computed(() => props.survey.progressValue + "%");

const getProgressTextInBarCss = (css: any) =>
  SurveyProgressModel.getProgressTextInBarCss(css);
const getProgressTextUnderBarCss = (css: any) =>
  SurveyProgressModel.getProgressTextUnderBarCss(css);
</script>
