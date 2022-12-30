<template>
  <div :class="survey.getProgressCssClasses()">
    <div
      :class="css.progressBar"
      :style="{ width: progress }"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span :class="getProgressTextInBarCss(css)">{{
        survey.progressText
      }}</span>
    </div>
    <span :class="getProgressTextUnderBarCss(css)">{{
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