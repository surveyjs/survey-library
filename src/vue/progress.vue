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

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel, SurveyProgressModel } from "survey-core";

@Component
export class Progress extends Vue {
  @Prop() survey: SurveyModel;
  @Prop() container: string;
  @Prop() css: any;
  public get progress() {
    return this.survey.progressValue + "%";
  }
  public getProgressTextInBarCss(css: any): string {
    return SurveyProgressModel.getProgressTextInBarCss(css);
  }
  public getProgressTextUnderBarCss(css: any): string {
    return SurveyProgressModel.getProgressTextUnderBarCss(css);
  }
}
Vue.component("sv-progress-pages", Progress);
Vue.component("sv-progress-questions", Progress);
Vue.component("sv-progress-correctquestions", Progress);
Vue.component("sv-progress-requiredquestions", Progress);
export default Progress;
</script>