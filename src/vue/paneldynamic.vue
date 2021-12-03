<template>
  <div :class="question.cssClasses.root">
    <survey-paneldynamicprogress
      v-if="question.isProgressTopShowing"
      :question="question"
    />
    <template v-for="panel in renderedPanels">
      <div :class="question.getPanelWrapperCss()" :key="panel.id">
        <survey-panel :question="panel" :css="css" />
        <survey-paneldynamicremove :question="question" :panel="panel" />
      </div>
      <hr :class="question.cssClasses.separator" :key="'separator' + panel.id" />
    </template>
    <survey-paneldynamicprogress
      v-if="question.isProgressBottomShowing"
      :question="question"
    />
    <button
      type="button"
      v-if="question.isRenderModeList && question.canAddPanel"
      :class="question.getAddButtonCss()"
      @click="addPanelClick"
    >
      <span :class="question.cssClasses.buttonAddText">
        {{ question.panelAddText }}
      </span>
    </button>
    <survey-paneldynamicprogress-v2
      :question="question"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { PanelModel, QuestionPanelDynamicModel } from "survey-core";
import { default as QuestionVue } from "./question";

@Component
export class PanelDynamic extends QuestionVue<QuestionPanelDynamicModel> {
  get renderedPanels(): PanelModel[] {
    if (this.question.isRenderModeList) return this.question.panels;
    const panels = [];
    if (this.question.currentPanel) {
      panels.push(this.question.currentPanel);
    }
    return panels;
  }
  addPanelClick() {
    this.question.addPanel();
  }
}
Vue.component("survey-paneldynamic", PanelDynamic);
export default PanelDynamic;
</script>
