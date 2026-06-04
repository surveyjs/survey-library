<template>
  <div :class="model.getProgressCssClasses(container)">
    <div
      :class="model.css.progressBar"
      :style="{ width: progress }"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="model.progressBarAriaLabel"
    >
      <span :class="getProgressTextInBarCss(model.css)">{{
        model.progressText
      }}</span>
    </div>
    <span :class="getProgressTextUnderBarCss(model.css)">{{
      model.progressText
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import { computed } from "vue";
import { SurveyProgressModel } from "survey-core";

const props = defineProps<{
  model: any;
  container?: string;
  css?: any;
}>();
useBase(() => props.model);
const progress = computed(() => props.model.progressValue + "%");

const getProgressTextInBarCss = (css: any) =>
  SurveyProgressModel.getProgressTextInBarCss(css);
const getProgressTextUnderBarCss = (css: any) =>
  SurveyProgressModel.getProgressTextUnderBarCss(css);
</script>
