<template>
  <div v-if="model.isRunning && model.showTimerAsClock" :class="model.rootCss">
    <svg
      v-if="model.showProgress"
      :class="model.getProgressCss()"
      :style="{ strokeDasharray: circleRadius, strokeDashoffset: progress }"
    >
      <use :xlink:href="'#icon-timercircle'"></use>
    </svg>
    <div :class="model.textContainerCss">
      <span :class="model.majorTextCss">{{ model.clockMajorText }}</span>
      <span v-if="!!model.clockMinorText" :class="model.minorTextCss">{{
        model.clockMinorText
      }}</span>
    </div>
  </div>
  <div
    v-else
    v-show="model.isRunning && !model.showTimerAsClock"
    :class="model.survey.getCss().timerRoot"
  >
    {{ text }}
  </div>
</template>

<script lang="ts" setup>
import type { SurveyTimerModel } from "survey-core";
import { useBase } from "./base";
import { computed } from "vue";

const props = defineProps<{
  model: SurveyTimerModel;
  css?: any;
}>();
const circleRadius: number = 440;
const progress = computed(() => circleRadius * props.model.progress);
const text = computed(() => props.model.text);

useBase(() => props.model);
</script>
