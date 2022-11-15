<template>
  <div v-if="timerModel.showTimerAsClock" :class="timerModel.rootCss">
    <svg
      :class="timerModel.getProgressCss()"
      :style="{ strokeDasharray: circleRadius, strokeDashoffset: progress }"
    >
      <use :xlink:href="'#icon-timercircle'"></use>
    </svg>
    <div :class="timerModel.textContainerCss">
      <span :class="timerModel.majorTextCss">{{ timerModel.clockMajorText }}</span>
      <span v-if="!!timerModel.clockMinorText" :class="timerModel.minorTextCss">{{ timerModel.clockMinorText }}</span>
    </div>
  </div>
  <div v-else :class="timerModel.survey.getCss().timerRoot">
    {{ timerModel.text }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Base, SurveyTimerModel } from "survey-core";
import { BaseVue } from "./base";

@Component
export class TimerPanel extends BaseVue {
  @Prop() timerModel: SurveyTimerModel;
  @Prop() css: any;
  public readonly circleRadius: number = 440;
  public get progress(): number {
    return -this.circleRadius * this.timerModel.progress;
  }
  get text() {
    return this.timerModel.text;
  }
  protected getModel(): Base {
    return this.timerModel;
  }
}
Vue.component("survey-timerpanel", TimerPanel);
export default TimerPanel;
</script>
