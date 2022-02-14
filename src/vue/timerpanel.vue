<template>
  <div>{{ text }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyTimerModel } from "survey-core";

@Component
export class TimerPanel extends Vue {
  @Prop() timerModel: SurveyTimerModel;
  @Prop() css: any;
  get text() {
    return this.timerModel.text;
  }
}
Vue.component("survey-timerpanel", TimerPanel);
export default TimerPanel;
</script>
