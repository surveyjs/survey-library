<template>
  <div :class="question.cssClasses.root">
    <div v-if="question.getShowNoEntriesPlaceholder()" :class="question.cssClasses.noEntriesPlaceholder">
      <span>
        <survey-string :locString="question.locNoEntriesText"></survey-string>
      </span>
      <sv-paneldynamic-add-btn :data="{ question }" />
    </div>
    <div :class="question.cssClasses.progress" v-if="!showLegacyNavigation && question.isProgressTopShowing && question.isRangeShowing">
      <div
        :class="question.cssClasses.progressBar"
        :style="{ width: question.progress }"
        role="progressbar"
      ></div>
    </div>
    <survey-paneldynamicprogress
      v-if="showLegacyNavigation && question.isProgressTopShowing"
      :question="question"
    />
    <div :class="question.cssClasses.panelsContainer">
      <template v-for="(panel, index) in question.renderedPanels">
        <div :class="question.getPanelWrapperCss(panel)" :key="panel.id">
          <survey-panel :question="panel" :css="css" />
          <sv-paneldynamic-remove-btn v-if="question.panelRemoveButtonLocation === 'right' && question.canRemovePanel && panel.state !== 'collapsed'" :data="{ question, panel }" />
        </div>
        <hr :class="question.cssClasses.separator" v-if="question.isRenderModeList && index < question.visiblePanelCount - 1" :key="'separator' + panel.id" />
      </template>
    </div>
    <survey-paneldynamicprogress
      v-if="showLegacyNavigation && question.isProgressBottomShowing"
      :question="question"
    />
    <sv-paneldynamic-add-btn v-if="showLegacyNavigation && question.isRenderModeList" :data="{ question }" />
    <survey-paneldynamicprogress-v2 v-if="question.showNavigation" :question="question" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { PanelModel, QuestionPanelDynamicModel } from "survey-core";
import { default as QuestionVue } from "./question";

@Component
export class PanelDynamic extends QuestionVue<QuestionPanelDynamicModel> {
  get showLegacyNavigation() {
    return this.question["showLegacyNavigation"];
  }
}
Vue.component("survey-paneldynamic", PanelDynamic);
export default PanelDynamic;
</script>
