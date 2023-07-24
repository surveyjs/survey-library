<template>
  <div :class="getСssClass()">
    <div style="clear: both" :class="getСssClass()">
      <div :class="question.cssClasses.progressContainer">
        <sv-paneldynamic-prev-btn :data="{ question: question }" />
        <div
          :class="question.cssClasses.progress"
          v-if="question.isRangeShowing"
        >
          <div
            :class="question.cssClasses.progressBar"
            :style="{ width: question.progress }"
            role="progressbar"
          ></div>
        </div>
        <sv-paneldynamic-next-btn :data="{ question: question }" />
      </div>
      <sv-paneldynamic-add-btn :data="{ question: question }" />
      <sv-paneldynamic-progress-text :data="{ question: question }" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { QuestionPanelDynamicModel } from "survey-core";
const props = defineProps<{
  question: QuestionPanelDynamicModel;
}>();

const getСssClass = () => {
  return props.question.isProgressTopShowing
    ? props.question.cssClasses.progressTop
    : props.question.cssClasses.progressBottom;
};
</script>
