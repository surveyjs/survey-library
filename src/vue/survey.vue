<template>
    <div :class="css.root">
      <form>
        <div class="sv_custom_header"></div>
        <div class="sv_container">
          <div v-if="hasTitle" :class="css.header"><h3><survey-string :locString="survey.locTitle"/></h3></div>
          <template v-if="survey.state === 'starting'">
              <div :class="css.body">
                <survey-page :id="survey.startedPage.id" :survey="survey" :page="survey.startedPage" :css="css" />
                <div v-if="survey.isNavigationButtonsShowing" :class="css.footer">
                    <input type="button" :value="survey.startSurveyText" :class="getNavBtnClasses('start')" @click="start"/>
                </div>
              </div>
          </template>
          <template v-if="survey.state === 'running'">
              <div :class="css.body">
                <survey-progress v-if="survey.isShowProgressBarOnTop" :survey="survey" :css="css"/>
                <survey-timerpanel v-if="survey.isTimerPanelShowingOnTop" :survey="survey" :css="css"/>
                <survey-page :id="survey.currentPage.id" :survey="survey" :page="survey.currentPage" :css="css" />
                <survey-timerpanel v-if="survey.isTimerPanelShowingOnBottom" :survey="survey" :css="css"/>
                <survey-progress style="margin-top: 1em" v-if="survey.isShowProgressBarOnBottom" :survey="survey" :css="css"/>
                <div v-if="survey.isNavigationButtonsShowing" :class="css.footer">
                    <input type="button" :value="survey.pagePrevText" v-show="!survey.isFirstPage && survey.isShowPrevButton" :class="getNavBtnClasses('prev')" @click="prevPage"/>
                    <input type="button" :value="survey.pageNextText" v-show="!survey.isLastPage" :class="getNavBtnClasses('next')" @click="nextPage"/>
                    <input v-if="survey.isEditMode" type="button" :value="survey.completeText" v-show="survey.isLastPage" :class="getNavBtnClasses('complete')" @click="completeLastPage"/>
                </div>
              </div>
          </template>
          <div v-if="hasCompletedPage">
              <div v-html="survey.processedCompletedHtml" :class="getCompletedPageClasses()"></div>
              <div v-if="survey.completedState != ''" :class="css.saveData.root">
                  <div :class="getCompletedStateClasses()"><span>{{survey.completedStateText}}</span>
                      <input type="button" v-if="survey.completedState == 'error'" :value="survey.getLocString('saveAgainButton')" @click="doTrySaveAgain" :class="css.saveData.saveAgainButton" />
                  </div>
              </div>
          </div>
          <div v-if="survey.state === 'completedbefore'" :class="css.body" v-html="survey.processedCompletedBeforeHtml"></div>
          <div v-if="survey.state === 'loading'" :class="css.body" v-html="survey.processedLoadingHtml"></div>
          <div v-if="survey.state === 'empty'" :class="css.body">{{survey.emptySurveyText}}</div>
        </div>
      </form>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { surveyCss } from "../defaultCss/cssstandard";
import { VueSurveyModel as SurveyModel } from "./surveyModel";

@Component
export class Survey extends Vue {
  @Prop survey: SurveyModel;

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
  getNavBtnClasses(btnType:any) {
    const btnClass = this.css.navigation[btnType];
    return this.css.navigationButton + " " + btnClass;
  }
  getCompletedPageClasses() {
    var css = this.css;
    return css.body + " " + css.completedPage;
  }
  getCompletedStateClasses() {
    return this.css.saveData[this.survey.completedState];
  }
  start() {
    this.survey.start();
  }
  prevPage() {
    this.survey.prevPage();
  }
  nextPage() {
    this.survey.nextPage();
  }
  completeLastPage() {
    this.survey.completeLastPage();
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
    surveyCss.currentType = newType;
  },
  enumerable: true,
  configurable: false
});

Vue.component("survey", Survey);
export default Survey;
</script>
