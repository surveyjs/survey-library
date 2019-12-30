<template>
  <div style="clear:both;" :class="this.cssClass">
    <div :class="question.cssClasses.progressContainer">
      <div :title="question.panelPrevText">
        <svg viewBox="0 0 10 10" :class="getButtonPrevCss(question)" @click="prevPanelClick">
          <polygon points="2,2 0,4 5,9 10,4 8,2 5,5 " />
        </svg>
      </div>

      <div :class="question.cssClasses.progress" v-if="question.isRangeShowing">
        <div :class="question.cssClasses.progressBar" :style="{width: progress}" role="progressbar"></div>
      </div>

      <div :title="question.panelNextText">
        <svg viewBox="0 0 10 10" @click="nextPanelClick" :class="getButtonNextCss(question)">
          <polygon points="2,2 0,4 5,9 10,4 8,2 5,5 " />
        </svg>
      </div>
    </div>

    <input
      type="button"
      v-if="question.canAddPanel"
      :value="question.panelAddText"
      :class="question.cssClasses.button  + ' ' + question.cssClasses.buttonAdd"
      @click="addPanelClick"
    />

    <div :class="question.cssClasses.progressText">{{question.progressText}}</div>
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

  get cssClass() {
    return this.question.isProgressTopShowing ? 
          this.question.cssClasses.progressTop: this.question.cssClasses.progressBottom;
  }
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

  getButtonAddCss(question: Question) {}

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
