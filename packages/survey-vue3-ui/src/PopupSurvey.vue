<template>
  <div v-if="surveyWindow.isShowing" :style="{ maxWidth: surveyWindow.renderedWidth, width: surveyWindow.renderedWidth }"
    :class="surveyWindow.cssRoot" @scroll="doScroll">
    <div :class="surveyWindow.cssRootContent">
      <div :class="cssHeaderRoot()">
        <div v-if="surveyWindow.isCollapsed && !!surveyWindow.locTitle" :class="surveyWindow.cssHeaderTitleCollapsed">
          {{ surveyWindow.locTitle.renderedHtml }}
        </div>

        <div :class="surveyWindow.cssHeaderButtonsContainer">
          <div v-if="surveyWindow.allowFullScreen" :class="surveyWindow.cssHeaderFullScreenButton" @click="doToggleFullScreen">
            <sv-svg-icon v-if="surveyWindow.isFullScreen" :iconName="'icon-back-to-panel_16x16'" :size="16"> </sv-svg-icon>
            <sv-svg-icon v-if="!surveyWindow.isFullScreen" :iconName="'icon-full-screen_16x16'" :size="16"> </sv-svg-icon>
          </div>

          <div :class="surveyWindow.cssHeaderCollapseButton" @click="doExpand">
            <sv-svg-icon v-if="surveyWindow.isExpanded" :iconName="'icon-minimize_16x16'" :size="16"> </sv-svg-icon>
            <sv-svg-icon v-if="surveyWindow.isCollapsed" :iconName="'icon-restore_16x16'" :size="16"> </sv-svg-icon>
          </div>

          <div v-if="surveyWindow.allowClose" :class="surveyWindow.cssHeaderCloseButton" @click="doHide">
            <sv-svg-icon :iconName="'icon-close_16x16'" :size="16"> </sv-svg-icon>
          </div>
        </div>
      </div>
      <div :class="surveyWindow.cssBody">
        <component :is="getSurveyComponentName()" :survey="survey"> </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PopupSurveyModel, type SurveyModel } from "survey-core";
import { shallowRef, type ShallowRef, watch, computed, onUnmounted } from "vue";
import { useBase } from "./base";

const props = defineProps<{
  survey: SurveyModel;
  isExpanded: boolean;
  allowClose: boolean;
  allowFullScreen: boolean;
  closeOnCompleteTimeout: number;
}>();
const surveyWindow =
  shallowRef<PopupSurveyModel>() as ShallowRef<PopupSurveyModel>;
const css = computed(() => {
  return props.survey ? props.survey.getCss() : {};
});
const expandedCss = computed(() => {
  return surveyWindow.value?.isExpanded
    ? css.value.window.header.buttonCollapsed
    : css.value.window.header.buttonExpanded;
});
const isExpandedSurvey = computed(() => {
  return surveyWindow.value?.isExpanded as boolean;
});

const doExpand = () => {
  surveyWindow.value.changeExpandCollapse();
};
const doHide = () => {
  surveyWindow.value.hide();
};
const doToggleFullScreen = () => {
  surveyWindow.value.toggleFullScreen();
};
const getSurveyComponentName = () => {
  return "SurveyComponent";
};
const doScroll = () => {
  surveyWindow.value.onScroll();
};

const cssHeaderRoot = () => {
  let headerCss = surveyWindow.value.cssHeaderRoot;
  if (surveyWindow.value.isCollapsed) {
    headerCss += " " + surveyWindow.value.cssRootCollapsedMod;
  }
  return headerCss;
}

useBase(() => surveyWindow.value);

const stopWatch = watch(
  () => props.survey,
  (newValue) => {
    const model = new PopupSurveyModel(null, newValue);
    if (props.isExpanded !== undefined) {
      model.isExpanded = props.isExpanded;
    }
    if (props.closeOnCompleteTimeout !== undefined) {
      model.closeOnCompleteTimeout = props.closeOnCompleteTimeout;
    }
    if (props.allowClose !== undefined) {
      model.allowClose = props.allowClose;
    }
    if (props.allowFullScreen !== undefined) {
      model.allowFullScreen = props.allowFullScreen;
    }
    model.isShowing = true;
    surveyWindow.value = model;
  },
  {
    immediate: true,
  }
);
onUnmounted(() => {
  stopWatch();
});
</script>
