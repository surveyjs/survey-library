<template>
  <div :class="css.root">
    <form onsubmit="return false;">
      <div v-if="!survey.hasLogo" class="sv_custom_header"></div>
      <div :class="css.container">
        <survey-header :survey="survey" />
        <template v-if="survey.state === 'starting'">
          <div :class="css.body">
            <div
              v-if="
                survey.isNavigationButtonsShowing === 'top' ||
                  survey.isNavigationButtonsShowing === 'both'
              "
              :class="css.footer"
            >
              <input
                type="button"
                :value="survey.startSurveyText"
                :class="survey.cssNavigationStart"
                @click="start"
              />
            </div>
            <survey-page
              :id="survey.startedPage.id"
              :survey="survey"
              :page="survey.startedPage"
              :css="css"
            />
            <div
              v-if="
                survey.isNavigationButtonsShowing === 'bottom' ||
                  survey.isNavigationButtonsShowing === 'both'
              "
              :class="css.footer"
            >
              <input
                type="button"
                :value="survey.startSurveyText"
                :class="survey.cssNavigationStart"
                @click="start"
              />
            </div>
          </div>
        </template>
        <template v-if="survey.state === 'running' || survey.state === 'preview'">
          <div :class="css.body">
            <survey-progress v-if="survey.isShowProgressBarOnTop" :survey="survey" :css="css" />
            <survey-timerpanel v-if="survey.isTimerPanelShowingOnTop" :survey="survey" :css="css" />
            <survey-navigation
              v-if="survey.isNavigationButtonsShowing === 'top' ||
                  survey.isNavigationButtonsShowing === 'both'"
              :survey="survey"
              :css="css"
            />
            <survey-page
              :id="survey.currentPage.id"
              :survey="survey"
              :page="survey.currentPage"
              :css="css"
            />
            <survey-timerpanel
              v-if="survey.isTimerPanelShowingOnBottom"
              :survey="survey"
              :css="css"
            />
            <survey-progress v-if="survey.isShowProgressBarOnBottom" :survey="survey" :css="css" />
            <survey-navigation
              v-if="survey.isNavigationButtonsShowing === 'bottom' ||
                  survey.isNavigationButtonsShowing === 'both'"
              :survey="survey"
              :css="css"
            />
          </div>
        </template>
        <div v-if="hasCompletedPage">
          <div v-html="getProcessedCompletedHtml()" :class="getCompletedPageClasses()"></div>
          <div v-if="survey.completedState != ''" :class="css.saveData.root">
            <div :class="getCompletedStateClasses()">
              <span>{{ survey.completedStateText }}</span>
              <input
                type="button"
                v-if="survey.completedState == 'error'"
                :value="survey.getLocString('saveAgainButton')"
                @click="doTrySaveAgain"
                :class="css.saveData.saveAgainButton"
              />
            </div>
          </div>
        </div>
        <div
          v-if="survey.state === 'completedbefore'"
          :class="css.body"
          v-html="survey.processedCompletedBeforeHtml"
        ></div>
        <div
          v-if="survey.state === 'loading'"
          :class="css.body"
          v-html="survey.processedLoadingHtml"
        ></div>
        <div v-if="survey.state === 'empty'" :class="css.bodyEmpty">{{ survey.emptySurveyText }}</div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { surveyCss } from "../defaultCss/cssstandard";
import { VueSurveyModel as SurveyModel } from "./surveyModel";
import { StylesManager } from "../stylesmanager";

@Component
export class Survey extends Vue {
  @Prop survey: SurveyModel;
  processedCompletedHtmlValue: string;

  forceUpdate() {
    this.$forceUpdate();
  }

  constructor() {
    super();
  }

  mounted() {
    var el = this.$el;
    if (el && this.survey) this.survey.doAfterRenderSurvey(el);
    this.survey.renderCallback = this.forceUpdate;
    this.survey.startTimerFromUI();
  }
  beforeDestroy() {
    this.survey.stopTimer();
    this.survey.renderCallback = undefined;
  }

  get hasTitle() {
    return !!this.survey.title && this.survey.showTitle;
  }
  get hasCompletedPage() {
    return this.survey.showCompletedPage && this.survey.state === "completed";
  }
  get css() {
    return this.survey.css;
  }
  getCompletedPageClasses() {
    var css = this.css;
    return css.body + " " + css.completedPage;
  }
  getProcessedCompletedHtml() {
    if (!this.hasCompletedPage) return "";
    if (!this.processedCompletedHtmlValue) {
      this.processedCompletedHtmlValue = this.survey.processedCompletedHtml;
    }
    return this.processedCompletedHtmlValue;
  }
  getCompletedStateClasses() {
    return this.css.saveData[this.survey.completedState];
  }
  start() {
    this.survey.start();
  }
  doTrySaveAgain() {
    this.survey.doComplete();
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
  configurable: false
});

Vue.component("survey", Survey);
export default Survey;
</script>
