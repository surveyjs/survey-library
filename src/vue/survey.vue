<template>
  <div :class="survey.getRootCss()"
    :style="vueSurvey.themeVariables"
    >
    <sv-svg-bundle v-if="vueSurvey.needRenderIcons"></sv-svg-bundle>
    <div :class="vueSurvey.wrapperFormCss">
      <div v-if="vueSurvey.renderBackgroundImage" :class="css.rootBackgroundImage" :style="vueSurvey.backgroundImageStyle"></div>
      <form onsubmit="return false;">
        <div v-if="!vueSurvey.hasLogo" class="sv_custom_header"></div>
        <div :class="css.container">
          <survey-header v-if="vueSurvey.headerView === 'basic'" :survey="vueSurvey" />
          <component :is="'sv-components-container'" :survey="vueSurvey" :container="'header'"></component>
          <template
            v-if="vueSurvey.isShowingPage"
          >
            <div :class="vueSurvey.bodyContainerCss">
              <component :is="'sv-components-container'" :survey="vueSurvey" :container="'left'"></component>
              <div class="sv-components-column sv-components-column--expandable">
                <component :is="'sv-components-container'" :survey="vueSurvey" :container="'center'"></component>
                <div :class="vueSurvey.bodyCss"  :style="{maxWidth: survey.renderedWidth}" :id="pageId">
                  <component :is="'sv-components-container'" :survey="vueSurvey" :container="'contentTop'"></component>
                  <survey-page
                    :key="pageKey"
                    :survey="vueSurvey"
                    :page="vueSurvey.activePage"
                    :css="css"
                  />
                  <component :is="'sv-components-container'" :survey="vueSurvey" :container="'contentBottom'"></component>
                </div>
              </div>
              <component :is="'sv-components-container'" :survey="vueSurvey" :container="'right'"></component>
            </div>
          </template>
          <component :is="'sv-components-container'" :survey="vueSurvey" :container="'footer'"></component>
          <div v-if="hasCompletedPage">
            <div
              v-html="getProcessedCompletedHtml()"
              :class="vueSurvey.completedCss"
            ></div>
            <component :is="'sv-components-container'" :survey="vueSurvey" :container="'completePage'"></component>
          </div>
          <div
            v-if="vueSurvey.state === 'completedbefore'"
            :class="vueSurvey.completedBeforeCss"
            v-html="vueSurvey.processedCompletedBeforeHtml"
          ></div>
          <div
            v-if="vueSurvey.state === 'loading'"
            :class="vueSurvey.loadingBodyCss"
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
