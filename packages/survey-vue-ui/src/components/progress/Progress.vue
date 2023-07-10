<template>
  <div :class="survey.getProgressCssClasses()">
    <div :class="survey.css.progressBar" :style="{ width: progress }" role="progressbar" aria-valuemin="0"
      aria-valuemax="100">
      <span :class="getProgressTextInBarCss(survey.css)">{{
        survey.progressText
      }}</span>
    </div>
    <span :class="getProgressTextUnderBarCss(survey.css)">{{
      survey.progressText
    }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { SurveyModel, SurveyProgressModel } from "survey-core";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-components-container",
  props: {
    survey: Object as PropType<SurveyModel>,
    css: Object,
  },
  computed: {
    progress() {
      return this.survey.progressValue + "%";
    }
  },
  methods: {
    getProgressTextInBarCss(css: any): string {
      return SurveyProgressModel.getProgressTextInBarCss(css);
    },
    getProgressTextUnderBarCss(css: any): string {
      return SurveyProgressModel.getProgressTextUnderBarCss(css);
    },
  },
});
</script>