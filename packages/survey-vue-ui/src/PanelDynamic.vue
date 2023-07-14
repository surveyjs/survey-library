<template>
  <div :class="question.cssClasses.root">
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

<script lang="ts">
import { PanelModel, QuestionPanelDynamicModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent, type PropType, getCurrentInstance, watch, onUnmounted } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "survey-paneldynamic",
  props: {
    question: {
      type: Object as PropType<QuestionPanelDynamicModel>,
      required: true,
    },
    css: Object,
  },
  setup(props) {
    const instance = getCurrentInstance();

    const setupOnChangedCallback = (question: QuestionPanelDynamicModel) => {
      question.panelCountChangedCallback = () => {
        instance?.proxy?.$forceUpdate();
      };
      question.currentIndexChangedCallback = () => {
        instance?.proxy?.$forceUpdate();
      };
      question.renderModeChangedCallback = () => {
        instance?.proxy?.$forceUpdate();
      };
    };
    setupOnChangedCallback(props.question);
    const stopWatch = watch(
      () => props.question,
      (newValue, oldValue) => {
        oldValue.panelCountChangedCallback = () => {};
        oldValue.currentIndexChangedCallback = () => {};
        oldValue.renderModeChangedCallback = () => {};
        setupOnChangedCallback(newValue);
      }
    );
    onUnmounted(() => {
      stopWatch();
    });
  },
  methods: {
    getShowLegacyNavigation() {
      return this.question["showLegacyNavigation"];
    },
  },
  computed: {
    renderedPanels(): PanelModel[] {
      if (this.question.isRenderModeList) return this.question.panels;
      const panels = [];
      if (this.question.currentPanel) {
        panels.push(this.question.currentPanel);
      }
      return panels;
    },
  },
});
</script>
