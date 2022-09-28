<template>
  <button
    type="button"
    v-show="!isCollapsed"
    v-if="question.canRemovePanel && !question.isReadOnly"
    :class="question.getPanelRemoveButtonCss()"
    @click="removePanelClick(panel)" >
    <span 
    :class="question.cssClasses.buttonRemoveText">{{question.panelRemoveText}}</span>
    <span :class="question.cssClasses.iconRemove"></span>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { QuestionPanelDynamicModel } from "survey-core";
import { PanelModel } from "survey-core";
import { ISurvey } from "survey-core";

@Component
export class PanelDynamicRemove extends Vue {
  @Prop() question: QuestionPanelDynamicModel;
  @Prop() panel: PanelModel;
  private isCollapsedValue: boolean = false;

  mounted() {
    this.isCollapsed = this.panel.isCollapsed;
    this.panel.registerPropertyChangedHandlers(["state"], (val: any) => {
      this.isCollapsed = this.panel.isCollapsed;
    }, "button");
  }
  beforeDestroy() {
    this.panel.unregisterPropertyChangedHandlers(["state"], "button");
  }
  removePanelClick(panel: any) {
    if (!this.question.isInputReadOnly) {
      this.question.removePanelUI(panel);
    }
  }
  get isCollapsed() {
    return this.isCollapsedValue;
  }
  set isCollapsed(val: boolean) {
    this.isCollapsedValue = val;
  }
}
Vue.component("survey-paneldynamicremove", PanelDynamicRemove);
export default PanelDynamicRemove;
</script>
