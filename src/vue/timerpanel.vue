<template>
  <div v-if="model.isRunning && model.showTimerAsClock" :class="model.rootCss">
    <svg
      v-if="model.showProgress"
      :class="model.getProgressCss()"
      :style="{ strokeDasharray: circleRadius, strokeDashoffset: progress }"
    >
      <use :xlink:href="'#icon-timercircle'"></use>
    </svg>
    <div :class="model.textContainerCss">
      <span :class="model.majorTextCss">{{ model.clockMajorText }}</span>
      <span v-if="!!model.clockMinorText" :class="model.minorTextCss">{{ model.clockMinorText }}</span>
    </div>
  </div>
  <div v-else v-show="model.isRunning && !model.showTimerAsClock" :class="model.survey.getCss().timerRoot">
    {{ text }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Base, SurveyTimerModel } from "survey-core";
import { BaseVue } from "./base";

@Component
export class TimerPanel extends BaseVue {
  @Prop() model: SurveyTimerModel;
  @Prop() css: any;
  public readonly circleRadius: number = 440;
  public get progress(): number {
    return -this.circleRadius * this.model.progress;
  }
  get text() {
    return this.model.text;
  }
  protected getModel(): Base {
    return this.model;
  }
}
Vue.component("sv-timerpanel", TimerPanel);
export default TimerPanel;
</script>
