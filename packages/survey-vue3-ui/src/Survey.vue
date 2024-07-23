<template>
  <div
    :class="vueSurvey.getRootCss()"
    :style="vueSurvey.themeVariables"
    :lang="vueSurvey.locale || 'en'"
    :dir="vueSurvey.localeDir"
    ref="root"
  >
    <SurveyVueComponent
      :name="'sv-svg-bundle'"
      v-if="vueSurvey.needRenderIcons"
    ></SurveyVueComponent>
    <div :class="vueSurvey.wrapperFormCss">
      <SurveyVueComponent :name="'survey-popup-modal'" />
      <div
        v-if="vueSurvey.renderBackgroundImage"
        :class="css.rootBackgroundImage"
        :style="vueSurvey.backgroundImageStyle"
      ></div>
      <form onsubmit="return false;">
        <div v-if="!vueSurvey.hasLogo" class="sv_custom_header"></div>
        <div :class="css.container">
          <SurveyVueComponent
            :name="'survey-header'"
            v-if="vueSurvey.headerView === 'basic'"
            :survey="vueSurvey"
          />
          <SurveyVueComponent
            :name="'sv-components-container'"
            :survey="vueSurvey"
            :container="'header'"
            :needRenderWrapper="false"
          ></SurveyVueComponent>
          <template v-if="vueSurvey.isShowingPage">
            <div :class="vueSurvey.bodyContainerCss">
              <SurveyVueComponent
                :name="'sv-components-container'"
                :survey="vueSurvey"
                :container="'left'"
                :needRenderWrapper="true"
              ></SurveyVueComponent>
              <div
                class="sv-components-column sv-components-column--expandable"
              >
                <SurveyVueComponent
                  :name="'sv-components-container'"
                  :survey="vueSurvey"
                  :container="'center'"
                  :needRenderWrapper="true"
                ></SurveyVueComponent>
                <div
                  :class="vueSurvey.bodyCss"
                  :style="{ maxWidth: vueSurvey.renderedWidth }"
                  :id="pageId"
                >
                  <SurveyVueComponent
                    :name="'sv-components-container'"
                    :survey="vueSurvey"
                    :container="'contentTop'"
                    :needRenderWrapper="true"
                  ></SurveyVueComponent>
                  <SurveyVueComponent
                    :name="'survey-page'"
                    :key="pageKey"
                    :survey="vueSurvey"
                    :page="vueSurvey.activePage"
                    :css="css"
                  />
                  <SurveyVueComponent
                    :name="'sv-components-container'"
                    :survey="vueSurvey"
                    :container="'contentBottom'"
                    :needRenderWrapper="true"
                  ></SurveyVueComponent>
                </div>
              </div>
              <SurveyVueComponent
                :name="'sv-components-container'"
                :survey="vueSurvey"
                :container="'right'"
                :needRenderWrapper="true"
              ></SurveyVueComponent>
            </div>
          </template>
          <SurveyVueComponent
            :name="'sv-components-container'"
            :survey="vueSurvey"
            :container="'footer'"
            :needRenderWrapper="false"
          ></SurveyVueComponent>
          <div v-if="hasCompletedPage">
            <div
              v-html="getProcessedCompletedHtml()"
              :class="vueSurvey.completedCss"
            ></div>
            <SurveyVueComponent
              :name="'sv-components-container'"
              :survey="vueSurvey"
              :container="'completePage'"
              :needRenderWrapper="true"
            ></SurveyVueComponent>
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
      <SurveyVueComponent
        :name="'sv-brand-info'"
        v-if="vueSurvey.showBrandInfo"
      ></SurveyVueComponent>
      <SurveyVueComponent
        :name="'sv-notifier'"
        :model="vueSurvey.notifier"
      ></SurveyVueComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
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

const setupSurvey = (model: SurveyModel) => {
  if (!model) return;
  var el = root.value;
  if (el) model.afterRenderSurvey(el);
  model.renderCallback = () => {
    updater.value++;
    getCurrentInstance()?.proxy?.$forceUpdate();
  };
  model.startTimerFromUI();
};

useBase(
  () => vueSurvey.value,
  (newValue: SurveyModel, oldValue?: SurveyModel) => {
    if (newValue && oldValue) {
      setupSurvey(newValue);
    }
  },
  (model: SurveyModel) => {
    model.stopTimer();
    model.renderCallback = undefined as any;
  }
);

onMounted(() => {
  setupSurvey(vueSurvey.value);
});

onUnmounted(() => {
  vueSurvey.value.stopTimer();
  vueSurvey.value.renderCallback = undefined as any;
});
</script>
