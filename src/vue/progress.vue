<template>
  <div :class="css.progress">
    <div
      :class="css.progressBar"
      :style="{ width: progress }"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span :class="css.progressText + ' ' + css.progressTextInBar">{{
        survey.progressText
      }}</span>
    </div>
    <span :class="css.progressText + ' ' + css.progressTextUnderBar">{{
      survey.progressText
    }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "survey-core";

@Component
export class Progress extends Vue {
  @Prop survey: SurveyModel;
  @Prop css: any;
  get progress() {
    return this.survey.progressValue + "%";
  }
}
Vue.component("sv-progress-pages", Progress);
Vue.component("sv-progress-questions", Progress);
Vue.component("sv-progress-correctquestions", Progress);
export default Progress;
</script>
