<template>
  <div v-if="surveyWindow.isShowing" :style="{ maxWidth: surveyWindow.renderedWidth, width: surveyWindow.renderedWidth }"
    :class="surveyWindow.cssRoot" @scroll="doScroll">
    <div :class="surveyWindow.cssRootContent">
      <div :class="cssHeaderRoot">
        <div v-if="surveyWindow.isCollapsed && !!surveyWindow.locTitle" :class="surveyWindow.cssHeaderTitleCollapsed">
          {{ surveyWindow.locTitle.renderedHtml }}
        </div>

        <div :class="surveyWindow.cssHeaderButtonsContainer">
          <div v-if="surveyWindow.allowFullScreen" :class="surveyWindow.cssHeaderFullScreenButton" @click="doToggleFullScreen">
            <sv-svg-icon v-if="surveyWindow.isFullScreen" :iconName="'icon-back-to-panel_16x16'" :size="16"> </sv-svg-icon>
            <sv-svg-icon v-if="!surveyWindow.isFullScreen" :iconName="'icon-full-screen_16x16'" :size="16"> </sv-svg-icon>
          </div>

          <div :class="surveyWindow.cssHeaderCollapseButton" @click="doExpand">
            <sv-svg-icon v-if="surveyWindow.isExpanded" :iconName="'icon-minimize_16x16'" :size="16"> </sv-svg-icon>
            <sv-svg-icon v-if="surveyWindow.isCollapsed" :iconName="'icon-restore_16x16'" :size="16"> </sv-svg-icon>
          </div>

          <div v-if="surveyWindow.allowClose" :class="surveyWindow.cssHeaderCloseButton" @click="doHide">
            <sv-svg-icon :iconName="'icon-close_16x16'" :size="16"> </sv-svg-icon>
          </div>
        </div>
      </div>
      <div :class="surveyWindow.cssBody">
        <component :is="getSurveyComponentName()" :survey="survey"> </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Base, PopupSurveyModel, SurveyModel } from "survey-core";
import { BaseVue } from "./base";

@Component
export class PopupSurvey extends BaseVue {
  @Prop() window: PopupSurveyModel;
  @Prop() survey: SurveyModel;
  @Prop() isExpanded: boolean;
  @Prop() isexpanded: boolean;
  @Prop() allowClose: boolean;
  @Prop() allowclose: boolean;
  @Prop() allowFullScreen: boolean;
  @Prop() allowfullscreen: boolean;
  @Prop() closeOnCompleteTimeout: number;

  surveyWindow: PopupSurveyModel;
  constructor() {
    super();
    if (this.window) {
      this.surveyWindow = this.window;
    } else {
      this.surveyWindow = new PopupSurveyModel(null, this.survey);
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
    if (this.allowclose !== undefined) {
      this.surveyWindow.allowClose = this.allowclose;
    }
    if (this.allowClose !== undefined) {
      this.surveyWindow.allowClose = this.allowClose;
    }
    if (this.allowfullscreen !== undefined) {
      this.surveyWindow.allowFullScreen = this.allowfullscreen;
    }
    if (this.allowFullScreen !== undefined) {
      this.surveyWindow.allowFullScreen = this.allowFullScreen;
    }
    this.surveyWindow.isShowing = true;
  }
  protected getModel(): Base {
    return this.surveyWindow;
  }

  get cssHeaderRoot(): string {
    let headerCss = this.surveyWindow.cssHeaderRoot;
    if (this.surveyWindow.isCollapsed) {
      headerCss += " " + this.surveyWindow.cssRootCollapsedMod;
    }
    return headerCss;
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
    this.surveyWindow.changeExpandCollapse();
  }
  doHide() {
    this.surveyWindow.hide();
  }
  doToggleFullScreen() {
    this.surveyWindow.toggleFullScreen();
  }
  getSurveyComponentName() {
    return "survey";
  }
  doScroll() {
    this.surveyWindow.onScroll();
  }
}

/**
 * Obsolete, please use PopupSurvey
 */
export class SurveyWindow extends PopupSurvey { }
Vue.component("survey-window", SurveyWindow);

Vue.component("popup-survey", PopupSurvey);
export default PopupSurvey;
</script>
