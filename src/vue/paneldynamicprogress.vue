<template>
  <div style="clear:both;">
    <div :class="question.cssClasses.progressContainer">
      <!-- <input
        type="button"
        :disabled="!question.isPrevButtonShowing"
        :class="question.cssClasses.buttonPrev"
      />-->
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 10 10"
        style="enable-background:new 0 0 10 10;"
        xml:space="preserve"
        :class="getButtonPrevCss(question)"
        @click="prevPanelClick"
        :title="question.panelPrevText"
      >
        <polygon class="st0" points="2,2 0,4 5,9 10,4 8,2 5,5 " />
      </svg>

      <div :class="question.cssClasses.progress">
        <div
          :class="question.cssClasses.progressBar"
          :style="{width: progress}"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <!-- <span>progress text: {{survey.progressText}}</span> -->
        </div>
      </div>

      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 10 10"
        style="enable-background:new 0 0 10 10;"
        xml:space="preserve"
        @click="nextPanelClick"
        :class="getButtonNextCss(question)"
        :title="question.panelNextText"
      >
        <polygon class="st0" points="2,2 0,4 5,9 10,4 8,2 5,5 " />
      </svg>
    </div>

    <input
      type="button"
      v-if="question.canAddPanel"
      :value="question.panelAddText"
      :class="question.cssClasses.button  + ' ' + question.cssClasses.buttonAdd"
      @click="addPanelClick"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { PanelModel } from "../panel";
import { QuestionPanelDynamicModel } from "../question_paneldynamic";
import { Question } from "../question";
import { QuestionRow } from "../knockout/kopage";

@Component
export class PanelDynamicProgress extends Vue {
  @Prop question: QuestionPanelDynamicModel;

  get rangeMax() {
    return this.question.panelCount - 1;
  }
  addPanelClick() {
    this.question.addPanelUI();
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

  getButtonPrevCss(question: Question) {
    var btnClasses = question.cssClasses.buttonPrev;
    if (!question.isPrevButtonShowing) {
      btnClasses += " " + question.cssClasses.buttonPrev + "--disabled";
    }
    return btnClasses;
  }

  getButtonNextCss(question: Question) {
    var btnClasses = question.cssClasses.buttonNext;
    if (!question.isNextButtonShowing) {
      btnClasses += " " + question.cssClasses.buttonNext + "--disabled";
    }
    return btnClasses;
  }

  get progress() {
    return this.question.currentIndex / this.rangeMax * 100 + "%";
  }
}

Vue.component("survey-paneldynamicprogress", PanelDynamicProgress);
export default PanelDynamicProgress;
</script>
