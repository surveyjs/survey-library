<template>
  <div style="clear: both" :class="this.cssClass">
    <div :class="question.cssClasses.progressContainer">
      <div :title="question.panelPrevText" @click="prevPanelClick">
        <sv-svg-icon :class="question.getPrevButtonCss()" :iconName="question.cssClasses.progressBtnIcon" :size="'auto'"></sv-svg-icon>
      </div>
      <div :class="question.cssClasses.progress" v-if="question.isRangeShowing">
        <div
          :class="question.cssClasses.progressBar"
          :style="{ width: question.progress }"
          role="progressbar"
        ></div>
      </div>
      <div :title="question.panelNextText" @click="nextPanelClick">
        <sv-svg-icon :class="question.getNextButtonCss()" :iconName="question.cssClasses.progressBtnIcon" :size="'auto'"></sv-svg-icon>
      </div>
    </div>
    <survey-paneldynamicadd :question="question" />
    <div :class="question.cssClasses.progressText">
      {{ question.progressText }}
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
  prevPanelClick() {
    this.question.goToPrevPanel();
  }
  nextPanelClick() {
    this.question.goToNextPanel();
  }

  changeRange(event: any) {
    this.question.currentIndex = event.target.value;
  }
}

Vue.component("survey-paneldynamicprogress", PanelDynamicProgress);
export default PanelDynamicProgress;
</script>
