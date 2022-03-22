<template>
  <div :class="css.timerRoot">{{ text }}</div>
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
