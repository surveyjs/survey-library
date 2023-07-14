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
    <div :class="surveyWindow.cssHeaderRoot" @click="doExpand">
      <span style="width: 100%; cursor: pointer; user-select: none">
        <span style="padding-right: 10px" :class="surveyWindow.cssHeaderTitle">
          <survey-string :locString="survey.locTitle" />
        </span>
        <span aria-hidden="true" :class="expandedCss"></span>
      </span>
      <span
        v-if="isExpandedSurvey"
        style="float: right; cursor: pointer; user-select: none"
      >
        <span style="padding-right: 10px" :class="surveyWindow.cssHeaderTitle"
          >X</span
        >
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

<script lang="ts">
import { onUnmounted, shallowRef, watch, defineComponent } from "vue";
import { PopupSurveyModel, SurveyModel } from "survey-core";
import { BaseVue } from "./base";
import type { PropType, ShallowRef } from "vue";

export default defineComponent({
  mixins: [BaseVue],
  props: {
    survey: { type: Object as PropType<SurveyModel>, required: true },
    isExpanded: Boolean,
    closeOnCompleteTimeout: Number,
  },
  setup(props) {
    const surveyWindow =
      shallowRef<PopupSurveyModel>() as ShallowRef<PopupSurveyModel>;
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
    return {
      surveyWindow,
    };
  },
  methods: {
    getModel() {
      return this.surveyWindow;
    },
    doExpand() {
      this.surveyWindow.changeExpandCollapse();
    },
    getSurveyComponentName() {
      return "SurveyRoot";
    },
    doScroll() {
      this.surveyWindow.onScroll();
    },
  },
  computed: {
    css() {
      return this.survey ? this.survey.getCss() : {};
    },
    expandedCss() {
      return this.surveyWindow?.isExpanded
        ? this.css.window.header.buttonCollapsed
        : this.css.window.header.buttonExpanded;
    },
    isExpandedSurvey(): boolean {
      return this.surveyWindow?.isExpanded as boolean;
    },
  },
});
</script>
