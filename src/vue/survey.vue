<template>
  <div :class="survey.getRootCss()">
    <form onsubmit="return false;">
      <div v-if="!vueSurvey.hasLogo" class="sv_custom_header"></div>
      <div :class="css.container">
        <survey-header :survey="vueSurvey" />
        <sv-components-container :survey="vueSurvey" :container="'top'"></sv-components-container>
        <template
          v-if="vueSurvey.isShowingPage"
        >
          <div :class="vueSurvey.bodyContainerCss">
            <sv-components-container :survey="vueSurvey" :container="'left'"></sv-components-container>
            <div :class="vueSurvey.bodyCss"  :style="{maxWidth: survey.renderedWidth}" :id="pageId">
              <sv-components-container :survey="vueSurvey" :container="'innertop'"></sv-components-container>
              <survey-page
                :key="pageKey"
                :survey="vueSurvey"
                :page="vueSurvey.activePage"
                :css="css"
              />
              <sv-components-container :survey="vueSurvey" :container="'innerbottom'"></sv-components-container>
            </div>
            <sv-components-container :survey="vueSurvey" :container="'right'"></sv-components-container>
          </div>
        </template>
        <sv-components-container :survey="vueSurvey" :container="'bottom'"></sv-components-container>
        <div v-if="hasCompletedPage">
          <div
            v-html="getProcessedCompletedHtml()"
            :class="vueSurvey.completedCss"
          ></div>
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
    <sv-notifier :model="vueSurvey.notifier"></sv-notifier>
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
  get pageKey() {
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
  get pageId(): string {
    return !!this.vueSurvey.activePage ? this.vueSurvey.activePage.id : "";
  }
  private getActivePageId(): string {
    const pageId = this.pageId;
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
  start() {
    this.vueSurvey.start();
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
