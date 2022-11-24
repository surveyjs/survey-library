<template>
  <div :class="survey.getRootCss()">
    <form onsubmit="return false;">
      <div v-if="!vueSurvey.hasLogo" class="sv_custom_header"></div>
      <div :class="css.container">
        <survey-header :survey="vueSurvey" />
          <component
                v-if="vueSurvey.isShowProgressBarOnTop && !vueSurvey.isShowStartingPage"
                :is="'sv-progress-' + vueSurvey.progressBarType.toLowerCase()"
                :survey="vueSurvey"
                :css="css"
              />
          <survey-timerpanel
            v-if="vueSurvey.isTimerPanelShowingOnTop && !vueSurvey.isShowStartingPage"
            :timerModel="vueSurvey.timerModel"
            :css="css"
          />
        <template
          v-if="vueSurvey.isShowingPage"
        >
          <div :class="vueSurvey.bodyCss"  :style="{maxWidth: survey.renderedWidth}">
            <sv-action-bar
              v-if="vueSurvey.isNavigationButtonsShowingOnTop"
              :key="navId + 'top'"
              :model="vueSurvey.navigationBar"
            />
            <survey-page
              :key="pageId"
              :survey="vueSurvey"
              :page="vueSurvey.activePage"
              :css="css"
            />
            <component
              v-if="vueSurvey.isShowProgressBarOnBottom && !vueSurvey.isShowStartingPage"
              :is="'sv-progress-' + vueSurvey.progressBarType.toLowerCase()"
              :survey="vueSurvey"
              :css="css"
            />
            <sv-action-bar
              v-if="vueSurvey.isNavigationButtonsShowingOnBottom"
              :key="navId + 'bottom'"
              :model="vueSurvey.navigationBar"
            />
          </div>
        </template>
        <survey-timerpanel
              v-if="vueSurvey.isTimerPanelShowingOnBottom && !vueSurvey.isShowStartingPage"
              :timerModel="vueSurvey.timerModel"
              :css="css"
            />
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
                :value="vueSurvey.getLocalizationString('saveAgainButton')"
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
    <sv-brand-info v-if="vueSurvey.showBrandInfo"></sv-brand-info>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Base, StylesManager, surveyCss, SvgRegistry, SurveyModel, doKey2ClickUp, IAttachKey2clickOptions } from "survey-core";
import { BaseVue } from "./base";

@Component
export class Survey extends BaseVue {
  @Prop() survey: SurveyModel;
  @Prop() model: SurveyModel;
  processedCompletedHtmlValue: string;
  updater: number = 1;
  get pageId() {
    return "page" + this.getActivePageId();
  }
  get navId() {
    return "nav" + this.getActivePageId();
  }

  constructor() {
    super();
    if(this.vueSurvey["needRenderIcons"]) {
      SvgRegistry.renderIcons();
    }
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
  forceUpdate() {
    this.updater += 1;
    this.$forceUpdate();
  }
  protected onMounted() {
    this.surveyOnMounted();
  }
  private getActivePageId(): string {
    const pageId = !!this.vueSurvey.activePage ? this.vueSurvey.activePage.id : "";
    return !!this.vueSurvey && pageId + this.updater.toString();
  }
  private surveyOnMounted() {
    if (!this.vueSurvey) return;
    var el = this.$el;
    if (el) this.vueSurvey.afterRenderSurvey(el);
    this.vueSurvey.valueHashSetDataCallback = (valuesHash: any, key: string, value: any): void => {
      Vue.set(valuesHash, key, value);
    };
    this.vueSurvey.valueHashDeleteDataCallback = (valuesHash: any, key: string): void => {
      Vue.delete(valuesHash, key);
    };
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

export function attachKey2click( evt: KeyboardEvent, options: IAttachKey2clickOptions = { processEsc: true }) {
  evt.preventDefault();
  evt.stopPropagation();
  doKey2ClickUp(evt, options);
}

Vue.component("survey", Survey);
export default Survey;
</script>
