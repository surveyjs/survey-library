<template>
  <div :class="question.cssClasses.root" ref="root">
    <div
      v-if="question.getShowNoEntriesPlaceholder()"
      :class="question.cssClasses.noEntriesPlaceholder"
    >
      <span>
        <SvComponent
          :is="'survey-string'"
          :locString="question.locNoEntriesText"
        ></SvComponent>
      </span>
      <SvComponent :is="'sv-paneldynamic-add-btn'" :data="{ question }" />
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
    <SvComponent
      :is="'survey-paneldynamicprogress'"
      v-if="getShowLegacyNavigation() && question.isProgressTopShowing"
      :question="question"
    />
    <div :class="question.cssClasses.panelsContainer">
      <template
        v-for="(panel, index) in question.renderedPanels"
        :key="panel.id"
      >
        <div :class="question.getPanelWrapperCss(panel)">
          <SvComponent
            :is="getPanelComponentName(panel)"
            v-bind="getPanelComponentData(panel)"
          ></SvComponent>
          <SvComponent
            :is="'sv-paneldynamic-remove-btn'"
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
    </div>
    <SvComponent
      :is="'survey-paneldynamicprogress'"
      v-if="getShowLegacyNavigation() && question.isProgressBottomShowing"
      :question="question"
    />
    <SvComponent
      :is="'sv-paneldynamic-add-btn'"
      v-if="getShowLegacyNavigation() && question.isRenderModeList"
      :data="{ question }"
    />
    <SvComponent
      :is="'survey-paneldynamicprogress-v2'"
      v-if="question.showNavigation"
      :question="question"
    />
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type {
  PanelModel,
  QuestionPanelDynamicModel,
  SurveyModel,
} from "survey-core";
import { useQuestion } from "./base";
import { getCurrentInstance, ref } from "vue";
defineOptions({ inheritAttrs: false });
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
    value.panelCountChangedCallback = undefined as any;
    value.currentIndexChangedCallback = undefined as any;
    value.renderModeChangedCallback = undefined as any;
  }
);

const getShowLegacyNavigation = () => {
  return props.question["showLegacyNavigation"];
};

const getPanelComponentName = (panel: PanelModel): string => {
  const survey = props.question.getSurvey() as SurveyModel;
  if (survey) {
    const name = survey.getElementWrapperComponentName(panel);
    if (name) {
      return name;
    }
  }
  return "panel";
};
const getPanelComponentData = (panel: PanelModel): any => {
  const survey = props.question.getSurvey() as SurveyModel;
  let data: any;
  if (survey) {
    data = survey.getElementWrapperComponentData(panel);
  }
  return {
    componentName: "survey-panel",
    componentData: {
      element: panel,
      data: data,
    },
  };
};
</script>
