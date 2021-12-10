<template>
  <div :class="css.root">
    <form onsubmit="return false;">
      <div v-if="!vueSurvey.hasLogo" class="sv_custom_header"></div>
      <div :class="css.container">
        <survey-header :survey="vueSurvey" />
        <template v-if="vueSurvey.state === 'starting'">
          <div :class="css.body">
            <div
              v-if="vueSurvey.isNavigationButtonsShowingOnTop"
              :class="css.footer"
            >
              <input
                type="button"
                :value="vueSurvey.startSurveyText"
                :class="vueSurvey.cssNavigationStart"
                @click="start"
              />
            </div>
            <survey-page
              :id="vueSurvey.startedPage.id"
              :survey="vueSurvey"
              :page="vueSurvey.startedPage"
              :css="css"
            />
            <div
              v-if="vueSurvey.isNavigationButtonsShowingOnBottom"
              :class="css.footer"
            >
              <input
                type="button"
                :value="vueSurvey.startSurveyText"
                :class="vueSurvey.cssNavigationStart"
                @click="start"
              />
            </div>
          </div>
        </template>
        <template
          v-if="vueSurvey.state === 'running' || vueSurvey.state === 'preview'"
        >
          <div :class="css.body">
            <component
              v-if="vueSurvey.isShowProgressBarOnTop"
              :is="'sv-progress-' + vueSurvey.progressBarType.toLowerCase()"
              :survey="vueSurvey"
              :css="css"
            />
            <survey-timerpanel
              v-if="vueSurvey.isTimerPanelShowingOnTop"
              :survey="vueSurvey"
              :css="css"
            />
            <survey-navigation
              v-if="vueSurvey.isNavigationButtonsShowingOnTop"
              :key="navId + 'top'"
              :survey="vueSurvey"
              :css="css"
            />
            <survey-page
              :key="pageId"
              :survey="vueSurvey"
              :page="vueSurvey.currentPage"
              :css="css"
            />
            <survey-timerpanel
              v-if="vueSurvey.isTimerPanelShowingOnBottom"
              :survey="vueSurvey"
              :css="css"
            />
            <component
              v-if="vueSurvey.isShowProgressBarOnBottom"
              :is="'sv-progress-' + vueSurvey.progressBarType.toLowerCase()"
              :survey="vueSurvey"
              :css="css"
            />
            <survey-navigation
              v-if="vueSurvey.isNavigationButtonsShowingOnBottom"
              :key="navId + 'bottom'"
              :survey="vueSurvey"
              :css="css"
            />
          </div>
        </template>
        <div v-if="hasCompletedPage">
          <div
            v-html="getProcessedCompletedHtml()"
            :class="vueSurvey.completedCss"
          ></div>
          <div v-if="vueSurvey.completedState != ''" :class="css.saveData.root">
            <div :class="getCompletedStateClasses()">
              <span>{{ vueSurvey.completedStateText }}</span>
              <input
                type="button"
                v-if="vueSurvey.completedState == 'error'"
                :value="vueSurvey.getLocString('saveAgainButton')"
                @click="doTrySaveAgain"
                :class="css.saveData.saveAgainButton"
              />
            </div>
          </div>
        </div>
        <div
          v-if="vueSurvey.state === 'completedbefore'"
          :class="css.body"
          v-html="vueSurvey.processedCompletedBeforeHtml"
        ></div>
        <div
          v-if="vueSurvey.state === 'loading'"
          :class="css.body"
          v-html="vueSurvey.processedLoadingHtml"
        ></div>
        <div v-if="vueSurvey.state === 'empty'" :class="css.bodyEmpty">
          {{ vueSurvey.emptySurveyText }}
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Base, StylesManager, surveyCss } from "survey-core";
import { VueSurveyModel as SurveyModel } from "./surveyModel";
import { BaseVue } from "./base";

@Component
export class Survey extends BaseVue {
  @Prop() survey: SurveyModel;
  @Prop() model: SurveyModel;
  processedCompletedHtmlValue: string;
  currentPageId: number = 1;
  get pageId() {
    return "page" + this.currentPageId.toString();
  }
  get navId() {
    return "nav" + this.currentPageId.toString();
  }

  forceUpdate() {
    this.$forceUpdate();
    this.currentPageId++;
  }

  constructor() {
    super();
  }
  protected getModel(): Base {
    return this.vueSurvey;
  }
  public get vueSurvey(): SurveyModel {
    return !!this.survey ? this.survey : this.model;
  }
  @Watch("model")
  @Watch("survey")
  onPropertyChanged(value: string, oldValue: string) {
    this.onCreated();
    this.surveyOnMounted();
  }
  protected onMounted() {
    this.surveyOnMounted();
  }
  private surveyOnMounted() {
    if (!this.vueSurvey) return;
    Vue.set(this.vueSurvey, "currentPage", this.vueSurvey.currentPage);
    this.vueSurvey.onCurrentPageChanged.add((sender, options) => {
      this.currentPageId++;
    });
    this.vueSurvey.onPageVisibleChanged.add((sender, options) => {
      this.currentPageId++;
    });
    var el = this.$el;
    if (el) this.vueSurvey.doAfterRenderSurvey(el);
    this.vueSurvey.renderCallback = this.forceUpdate;
    this.vueSurvey.startTimerFromUI();
  }
  beforeDestroy() {
    this.vueSurvey.stopTimer();
    this.vueSurvey.renderCallback = undefined;
  }

  get hasTitle() {
    return !!this.vueSurvey.title && this.vueSurvey.showTitle;
  }
  get hasCompletedPage() {
    return this.vueSurvey.showCompletedPage && this.vueSurvey.state === "completed";
  }
  get css() {
    return this.vueSurvey.css;
  }
  getProcessedCompletedHtml() {
    if (!this.hasCompletedPage) return "";
    if (!this.processedCompletedHtmlValue) {
      this.processedCompletedHtmlValue = this.vueSurvey.processedCompletedHtml;
    }
    return this.processedCompletedHtmlValue;
  }
  getCompletedStateClasses() {
    return this.css.saveData[this.vueSurvey.completedState];
  }
  start() {
    this.vueSurvey.start();
  }
  doTrySaveAgain() {
    this.vueSurvey.doComplete();
  }
}

// TODO: make this functionality available via surveyCss in all examples
Object.defineProperty(Survey, "cssType", {
  get: function() {
    return surveyCss.currentType;
  },
  set: function(newType) {
    StylesManager.applyTheme(newType);
  },
  enumerable: true,
  configurable: false,
});

Vue.component("survey", Survey);
export default Survey;
</script>
