<template>
  <div :class="question.cssClasses.root" ref="root">
    <div
      v-if="question.getShowNoEntriesPlaceholder()"
      :class="question.cssClasses.noEntriesPlaceholder"
    >
      <span>
        <survey-string :locString="question.locNoEntriesText"></survey-string>
      </span>
      <sv-paneldynamic-add-btn :data="{ question }" />
    </div>
    <div
      :class="question.cssClasses.progress"
      v-if="
        !getShowLegacyNavigation() &&
        question.isProgressTopShowing &&
        question.isRangeShowing
      "
    >
      <div
        :class="question.cssClasses.progressBar"
        :style="{ width: question.progress }"
        role="progressbar"
      ></div>
    </div>
    <survey-paneldynamicprogress
      v-if="getShowLegacyNavigation() && question.isProgressTopShowing"
      :question="question"
    />
    <template v-for="(panel, index) in renderedPanels" :key="panel.id">
      <div :class="question.getPanelWrapperCss()">
        <survey-panel :question="panel" :css="css" />
        <sv-paneldynamic-remove-btn
          v-if="
            question.panelRemoveButtonLocation === 'right' &&
            question.canRemovePanel &&
            panel.state !== 'collapsed'
          "
          :data="{ question, panel }"
        />
      </div>
      <hr
        :class="question.cssClasses.separator"
        v-if="
          question.isRenderModeList && index < question.visiblePanelCount - 1
        "
        :key="'separator' + panel.id"
      />
    </template>
    <survey-paneldynamicprogress
      v-if="getShowLegacyNavigation() && question.isProgressBottomShowing"
      :question="question"
    />
    <sv-paneldynamic-add-btn
      v-if="getShowLegacyNavigation() && question.isRenderModeList"
      :data="{ question }"
    />
    <survey-paneldynamicprogress-v2
      v-if="question.showNavigation"
      :question="question"
    />
  </div>
</template>

<script lang="ts" setup>
import type { QuestionPanelDynamicModel } from "survey-core";
import { useQuestion } from "./base";
import { computed, getCurrentInstance, ref } from "vue";
const props = defineProps<{ question: QuestionPanelDynamicModel; css?: any }>();
const root = ref(null);
const instance = getCurrentInstance();

useQuestion(
  props,
  root,
  (value) => {
    value.panelCountChangedCallback = () => {
      instance?.proxy?.$forceUpdate();
    };
    value.currentIndexChangedCallback = () => {
      instance?.proxy?.$forceUpdate();
    };
    value.renderModeChangedCallback = () => {
      instance?.proxy?.$forceUpdate();
    };
  },
  (value) => {
    value.panelCountChangedCallback = () => {};
    value.currentIndexChangedCallback = () => {};
    value.renderModeChangedCallback = () => {};
  }
);

const renderedPanels = computed(() => {
  if (props.question.isRenderModeList) return props.question.panels;
  const panels = [];
  if (props.question.currentPanel) {
    panels.push(props.question.currentPanel);
  }
  return panels;
});

const getShowLegacyNavigation = () => {
  return props.question["showLegacyNavigation"];
};
</script>
