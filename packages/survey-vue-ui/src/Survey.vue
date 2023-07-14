<template>
  <div :class="vueSurvey.getRootCss()" :style="vueSurvey.themeVariables">
    <div
      v-if="vueSurvey.renderBackgroundImage"
      :class="css.rootBackgroundImage"
      :style="vueSurvey.backgroundImageStyle"
    ></div>
    <form onsubmit="return false;">
      <div v-if="!vueSurvey.hasLogo" class="sv_custom_header"></div>
      <div :class="css.container">
        <survey-header :survey="vueSurvey" />
        <component
          :is="'sv-components-container'"
          :survey="vueSurvey"
          :container="'header'"
        ></component>
        <template v-if="vueSurvey.isShowingPage">
          <div :class="vueSurvey.bodyContainerCss">
            <component
              :is="'sv-components-container'"
              :survey="vueSurvey"
              :container="'left'"
            ></component>
            <div
              :class="vueSurvey.bodyCss"
              :style="{ maxWidth: vueSurvey.renderedWidth }"
              :id="pageId"
            >
              <component
                :is="'sv-components-container'"
                :survey="vueSurvey"
                :container="'contentTop'"
              ></component>
              <survey-page
                :key="pageKey"
                :survey="vueSurvey"
                :page="vueSurvey.activePage"
                :css="css"
              />
              <component
                :is="'sv-components-container'"
                :survey="vueSurvey"
                :container="'contentBottom'"
              ></component>
            </div>
            <component
              :is="'sv-components-container'"
              :survey="vueSurvey"
              :container="'right'"
            ></component>
          </div>
        </template>
        <component
          :is="'sv-components-container'"
          :survey="vueSurvey"
          :container="'footer'"
        ></component>
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
import { SvgRegistry, SurveyModel } from "survey-core";
import { type PropType, toRaw, defineComponent, ref } from "vue";
import { BaseVue } from "./base";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey",
  props: {
    model: Object as PropType<SurveyModel>,
    survey: Object as PropType<SurveyModel>,
  },
  mixins: [BaseVue],
  setup() {
    return {
      processedCompletedHtmlValue: ref(""),
      updater: ref(1),
    };
  },
  computed: {
    vueSurvey(): SurveyModel {
      const survey = this.survey ? this.survey : this.model;
      return toRaw(survey) as SurveyModel;
    },
    pageId() {
      return this.vueSurvey.activePage ? this.vueSurvey.activePage.id : "";
    },
    navId() {
      return "nav" + this.getActivePageId();
    },
    hasTitle() {
      return !!this.vueSurvey.title && this.vueSurvey.showTitle;
    },
    hasCompletedPage() {
      return (
        this.vueSurvey.showCompletedPage && this.vueSurvey.state === "completed"
      );
    },
    css(): any {
      return this.vueSurvey.css;
    },
    pageKey(): string {
      return "page" + this.getActivePageId();
    },
  },
  methods: {
    getActivePageId() {
      const pageId = this.pageId;
      return !!this.vueSurvey && pageId + this.updater.toString();
    },
    getProcessedCompletedHtml() {
      if (!this.hasCompletedPage) return "";
      if (!this.processedCompletedHtmlValue) {
        this.processedCompletedHtmlValue =
          this.vueSurvey.processedCompletedHtml;
      }
      return this.processedCompletedHtmlValue;
    },
    getCompletedStateClasses() {
      return this.css.saveData[this.vueSurvey.completedState];
    },
    start() {
      this.vueSurvey.start();
    },
    doTrySaveAgain() {
      this.vueSurvey.doComplete();
    },
    forceUpdate() {
      this.updater += 1;
      this.$forceUpdate();
    },
    getModel(): SurveyModel {
      return this.vueSurvey;
    },
  },
  mounted() {
    if (!this.vueSurvey) return;
    if (this.vueSurvey["needRenderIcons"]) {
      SvgRegistry.renderIcons();
    }
    var el = this.$el;
    if (el) this.vueSurvey.afterRenderSurvey(el);
    this.vueSurvey.renderCallback = this.forceUpdate;
    this.vueSurvey.startTimerFromUI();
  },
  unmounted() {
    this.vueSurvey.stopTimer();
    this.vueSurvey.renderCallback = undefined as any;
  },
});

// TODO: make this functionality available via surveyCss in all examples
//Object.defineProperty(Survey, "cssType", {
//  get: function() {
//    return surveyCss.currentType;
//  },
//  set: function(newType) {
//    StylesManager.applyTheme(newType);
//  },
//  enumerable: true,
//  configurable: false,
//});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
