<template>
  <div
    v-if="surveyWindow.isShowing"
    style="position: fixed; bottom: 3px; right: 10px"
    :style="{
      maxWidth: surveyWindow.renderedWidth,
      width: surveyWindow.renderedWidth,
    }"
    :class="surveyWindow.cssRoot"
  >
    <div :class="surveyWindow.cssHeaderRoot">
      <span
        @click="doExpand"
        style="width: 100%; cursor: pointer; user-select: none"
      >
        <span style="padding-right: 10px" :class="surveyWindow.cssHeaderTitle">
          <survey-string :locString="survey.locTitle" />
        </span>
        <span aria-hidden="true" :class="expandedCss"></span>
      </span>
      <span
        v-if="surveyWindow.allowClose"
        :class="surveyWindow.cssHeaderButton"
        @click="doHide"
        style="
          transform: rotate(45deg);
          float: right;
          cursor: pointer;
          user-select: none;
          width: 24px;
          height: 24px;
        "
      >
        <sv-svg-icon :iconName="'icon-expanddetail'" :size="16"> </sv-svg-icon>
      </span>
      <span
        v-if="isExpandedSurvey"
        :class="surveyWindow.cssHeaderButton"
        @click="doExpand"
        style="
          float: right;
          cursor: pointer;
          user-select: none;
          width: 24px;
          height: 24px;
        "
      >
        <sv-svg-icon :iconName="'icon-collapsedetail'" :size="16">
        </sv-svg-icon>
      </span>
    </div>
    <div
      v-if="isExpandedSurvey"
      :class="surveyWindow.cssBody"
      @scroll="doScroll"
    >
      <component :is="getSurveyComponentName()" :survey="survey"> </component>
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
