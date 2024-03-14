<template>
  <div :class="this.cssClass">
    <div style="clear: both" :class="this.cssClass">
      <div :class="question.cssClasses.progressContainer">
          <sv-paneldynamic-prev-btn :data="{ question: question }" />
        <div :class="question.cssClasses.progress" v-if="question.isRangeShowing">
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

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question, QuestionPanelDynamicModel, CssClassBuilder } from "survey-core";

@Component
export class PanelDynamicProgress extends Vue {
  @Prop() question: QuestionPanelDynamicModel;

  get cssClass() {
    return this.question.isProgressTopShowing
      ? this.question.cssClasses.progressTop
      : this.question.cssClasses.progressBottom;
  }
}

Vue.component("survey-paneldynamicprogress", PanelDynamicProgress);
export default PanelDynamicProgress;
</script>
