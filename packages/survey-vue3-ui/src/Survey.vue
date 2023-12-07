<template>
  <div
    :class="vueSurvey.getRootCss()"
    :style="vueSurvey.themeVariables"
    ref="root"
  >
    <sv-svg-bundle v-if="vueSurvey.needRenderIcons"></sv-svg-bundle>
    <div :class="vueSurvey.wrapperFormCss">
      <survey-popup-modal></survey-popup-modal>
      <div
        v-if="vueSurvey.renderBackgroundImage"
        :class="css.rootBackgroundImage"
        :style="vueSurvey.backgroundImageStyle"
      ></div>
      <form onsubmit="return false;">
        <div v-if="!vueSurvey.hasLogo" class="sv_custom_header"></div>
        <div :class="css.container">
          <survey-header
            v-if="vueSurvey.headerView === 'basic'"
            :survey="vueSurvey"
          />
          <component
            :is="'sv-components-container'"
            :survey="vueSurvey"
            :container="'header'"
            :needRenderWrapper="false"
          ></component>
          <template v-if="vueSurvey.isShowingPage">
            <div :class="vueSurvey.bodyContainerCss">
              <component
                :is="'sv-components-container'"
                :survey="vueSurvey"
                :container="'left'"
                :needRenderWrapper="true"
              ></component>
              <div class="sv-components-column sv-components-column--expandable">
                <component :is="'sv-components-container'" :survey="vueSurvey" :container="'center'" :needRenderWrapper="true"></component>
                <div
                  :class="vueSurvey.bodyCss"
                  :style="{ maxWidth: vueSurvey.renderedWidth }"
                  :id="pageId"
                >
                  <component
                    :is="'sv-components-container'"
                    :survey="vueSurvey"
                    :container="'contentTop'"
                    :needRenderWrapper="true"
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
                    :needRenderWrapper="true"
                  ></component>
                </div>
              </div>
              <component
                :is="'sv-components-container'"
                :survey="vueSurvey"
                :container="'right'"
                :needRenderWrapper="true"
              ></component>
            </div>
          </template>
          <component
            :is="'sv-components-container'"
            :survey="vueSurvey"
            :container="'footer'"
            :needRenderWrapper="false"
          ></component>
          <div v-if="hasCompletedPage">
            <div
              v-html="getProcessedCompletedHtml()"
              :class="vueSurvey.completedCss"
            ></div>
            <component
              :is="'sv-components-container'"
              :survey="vueSurvey"
              :container="'completePage'"
              :needRenderWrapper="true"
            ></component>
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

<script lang="ts" setup>
import type { SurveyModel } from "survey-core";
import {
  toRaw,
  ref,
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
} from "vue";
import { useBase } from "./base";

const props = defineProps<
  | {
      model: SurveyModel;
      survey?: SurveyModel;
    }
  | {
      model?: SurveyModel;
      survey: SurveyModel;
    }
>();
const root = ref<HTMLElement>();
const processedCompletedHtmlValue = ref("");
const updater = ref(1);
const vueSurvey = computed((): SurveyModel => {
  const survey = props.survey ? props.survey : props.model;
  return toRaw(survey) as SurveyModel;
});
const pageId = computed(() => {
  return vueSurvey.value.activePage ? vueSurvey.value.activePage.id : "";
});
const getActivePageId = () => {
  const id = pageId.value;
  return !!vueSurvey.value && id + updater.value.toString();
};
const hasCompletedPage = computed(
  () =>
    vueSurvey.value.showCompletedPage && vueSurvey.value.state === "completed"
);
const css = computed(() => vueSurvey.value.css);
const pageKey = computed(() => "page" + getActivePageId());

const getProcessedCompletedHtml = () => {
  if (!hasCompletedPage.value) return "";
  if (!processedCompletedHtmlValue.value) {
    processedCompletedHtmlValue.value = vueSurvey.value.processedCompletedHtml;
  }
  return processedCompletedHtmlValue.value;
};

useBase(() => vueSurvey.value);

onMounted(() => {
  if (!vueSurvey.value) return;
  var el = root.value;
  if (el) vueSurvey.value.afterRenderSurvey(el);
  vueSurvey.value.renderCallback = () => {
    updater.value++;
    getCurrentInstance()?.proxy?.$forceUpdate();
  };
  vueSurvey.value.startTimerFromUI();
});
onUnmounted(() => {
  vueSurvey.value.stopTimer();
  vueSurvey.value.renderCallback = undefined as any;
});
</script>
