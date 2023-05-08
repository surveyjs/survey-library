<template>
  <div
    :class="survey.getRootCss()"
    :style="{
      backgroundImage: vueSurvey.renderBackgroundImage,
      backgroundSize: vueSurvey.backgroundImageFit,
    }"
  >
    <form
      onsubmit="return false;"
      :style="{ backgroundColor: vueSurvey.renderBackgroundOpacity }"
    >
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
              :style="{ maxWidth: survey.renderedWidth }"
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
          <div v-html="getProcessedCompletedHtml()" :class="vueSurvey.completedCss"></div>
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
import { reactive, isReactive } from "vue";
import { defineSurveyComponent } from "./base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey",
  props: {
    model: SurveyModel,
    survey: SurveyModel,
  },
  data: (vm: any) => {
    return {
      processedCompletedHtmlValue: "",
      updater: 1,
      getModel: () => {
        return vm.vueSurvey;
      },
      getActivePageId: () => {
        const pageId = !!vm.vueSurvey.activePage ? vm.vueSurvey.activePage.id : "";
        return !!vm.vueSurvey && pageId + vm.updater.toString();
      },
      getProcessedCompletedHtml: () => {
        if (!vm.hasCompletedPage) return "";
        if (!vm.processedCompletedHtmlValue) {
          vm.processedCompletedHtmlValue = vm.vueSurvey.processedCompletedHtml;
        }
        return vm.processedCompletedHtmlValue;
      },
      getCompletedStateClasses: () => {
        return vm.css.saveData[vm.vueSurvey.completedState];
      },
      start: () => {
        vm.vueSurvey.start();
      },
      doTrySaveAgain: () => {
        vm.vueSurvey.doComplete();
      },
      forceUpdate: () => {
        vm.updater += 1;
        //vm.$forceUpdate();
      },
    };
  },
  computed: {
    vueSurvey(): SurveyModel {
      const survey = !!this.survey ? this.survey : this.model;
      return isReactive(survey) ? survey : reactive(survey);
    },
    pageId: {
      get() {
        return "page" + this.getActivePageId();
      },
    },
    navId: {
      get() {
        return "nav" + this.getActivePageId();
      },
    },
    hasTitle: {
      get() {
        return !!this.vueSurvey.title && this.vueSurvey.showTitle;
      },
    },
    hasCompletedPage: {
      get() {
        return this.vueSurvey.showCompletedPage && this.vueSurvey.state === "completed";
      },
    },
    css(): any {
      return this.vueSurvey.css;
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
    this.vueSurvey.renderCallback = undefined;
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
