<template>
  <div :class="getCssClass()">
    <div style="clear: both" :class="getCssClass()">
      <div :class="question.cssClasses.progressContainer">
        <SvComponent
          :is="'sv-paneldynamic-prev-btn'"
          :data="{ question: question }"
        />
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
        <SvComponent
          :is="'sv-paneldynamic-next-btn'"
          :data="{ question: question }"
        />
      </div>
      <SvComponent
        :is="'sv-paneldynamic-add-btn'"
        :data="{ question: question }"
      />
      <SvComponent
        :is="'sv-paneldynamic-progress-text'"
        :data="{ question: question }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionPanelDynamicModel } from "survey-core";
const props = defineProps<{
  question: QuestionPanelDynamicModel;
}>();

const getCssClass = () => {
  return props.question.isProgressTopShowing
    ? props.question.cssClasses.progressTop
    : props.question.cssClasses.progressBottom;
};
</script>
