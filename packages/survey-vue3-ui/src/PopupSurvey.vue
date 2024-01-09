<template>
  <div
    v-if="surveyWindow.isShowing"
    :style="{maxWidth: surveyWindow.renderedWidth, width: surveyWindow.renderedWidth}"
    :class="surveyWindow.cssRoot"
  >
    <div :class="surveyWindow.cssRootContent">
      <div :class="cssHeaderRoot()">
        <div v-if="surveyWindow.isCollapsed && !!surveyWindow.locTitle" :class="surveyWindow.cssHeaderTitleCollapsed">
          {{ surveyWindow.locTitle.renderedHtml }}
        </div>

        <div :class="surveyWindow.cssHeaderButtonsContainer">
          <div :class="surveyWindow.cssHeaderCollapseButton" @click="doExpand">
            <!-- <sv-svg-icon v-if="surveyWindow.isExpanded" :iconName="'icon-minimize_16x16'" :size="16"> </sv-svg-icon> -->
            <svg v-if="surveyWindow.isExpanded" className="sv-svg-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 9H3C2.45 9 2 8.55 2 8C2 7.45 2.45 7 3 7H13C13.55 7 14 7.45 14 8C14 8.55 13.55 9 13 9Z"/>
            </svg>
            <!-- <sv-svg-icon v-if="surveyWindow.isCollapsed" :iconName="'icon-restore_16x16'" :size="16"> </sv-svg-icon> -->
            <svg v-if="surveyWindow.isCollapsed" className="sv-svg-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13H4C2.9 13 2 12.1 2 11V5C2 3.9 2.9 3 4 3H12C13.1 3 14 3.9 14 5V11C14 12.1 13.1 13 12 13ZM4 5V11H12V5H4Z"/>
            </svg>
          </div>

          <div v-if="surveyWindow.allowClose" :class="surveyWindow.cssHeaderCloseButton" @click="doHide">
            <svg className="sv-svg-icon" role="img" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.43 8.0025L13.7 3.7225C14.09 3.3325 14.09 2.6925 13.7 2.2925C13.31 1.9025 12.67 1.9025 12.27 2.2925L7.99 6.5725L3.72 2.3025C3.33 1.9025 2.69 1.9025 2.3 2.3025C1.9 2.6925 1.9 3.3325 2.3 3.7225L6.58 8.0025L2.3 12.2825C1.91 12.6725 1.91 13.3125 2.3 13.7125C2.69 14.1025 3.33 14.1025 3.73 13.7125L8.01 9.4325L12.29 13.7125C12.68 14.1025 13.32 14.1025 13.72 13.7125C14.11 13.3225 14.11 12.6825 13.72 12.2825L9.44 8.0025H9.43Z"/>
            </svg>
            <!-- <sv-svg-icon :iconName="'icon-close_16x16'" :size="16"> </sv-svg-icon> -->
          </div>
        </div>
      </div>
      <div v-if="isExpandedSurvey" :class="surveyWindow.cssBody" @scroll="doScroll">
        <component :is="getSurveyComponentName()" :survey="windowSurvey"> </component>
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
