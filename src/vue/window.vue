<template>
  <div
    v-show="surveyWindow.isShowing"
    style="position: fixed; bottom: 3px; right: 10px; max-width: 60%;"
    :class="css.window.root"
  >
    <div :class="css.window.header.root">
      <span @click="doExpand" style="width: 100%; cursor: pointer;">
        <span style="padding-right:10px" :class="css.window.header.title">
          <survey-string :locString="windowSurvey.locTitle" />
        </span>
        <span aria-hidden="true" :class="expandedCss"></span>
      </span>
      <span v-if="isExpandedSurvey" @click="doExpand" style="float: right; cursor: pointer;">
        <span style="padding-right:10px" :class="css.window.header.title">X</span>
      </span>
    </div>
    <div v-show="isExpandedSurvey" :class="css.window.body">
      <survey :survey="windowSurvey"></survey>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { SurveyModel } from "../survey";
import { SurveyWindowModel } from "../surveyWindow";
import { VueSurveyWindowModel } from "./surveyModel";

@Component
export class Window extends Vue {
  @Prop window: SurveyWindowModel;
  @Prop survey: SurveyModel;
  @Prop isExpanded: boolean;
  @Prop isexpanded: boolean;
  @Prop closeOnCompleteTimeout: number;

  surveyWindow: SurveyWindowModel;
  constructor() {
    super();
    if (this.window) {
      this.surveyWindow = this.window;
    } else {
      this.surveyWindow = new VueSurveyWindowModel(null, this.survey);
    }
    if (this.isexpanded !== undefined) {
      this.surveyWindow.isExpanded = this.isexpanded;
    }
    if (this.isExpanded !== undefined) {
      this.surveyWindow.isExpanded = this.isExpanded;
    }
    if (this.closeOnCompleteTimeout !== undefined) {
      this.surveyWindow.closeOnCompleteTimeout = this.closeOnCompleteTimeout;
    }
    this.surveyWindow.isShowing = true;
    var self = this;
    this.surveyWindow.closeWindowOnCompleteCallback = function() {
      self.doHide();
    };
  }
  get windowSurvey(): SurveyModel {
    return this.surveyWindow.survey;
  }
  get css() {
    return !!this.survey ? this.survey.getCss() : {};
  }
  get expandedCss() {
    return this.surveyWindow.isExpanded
      ? this.css.window.header.buttonCollapsed
      : this.css.window.header.buttonExpanded;
  }
  get isExpandedSurvey(): boolean {
    return this.surveyWindow.isExpanded;
  }
  set isExpandedSurvey(val: boolean) {
    this.surveyWindow.isExpanded = val;
  }
  doExpand() {
    this.surveyWindow.isExpanded = !this.surveyWindow.isExpanded;
  }
  doHide() {
    Vue.set(this.surveyWindow, "isShowing", false);
  }
}
Vue.component("survey-window", Window);
export default Window;
</script>
