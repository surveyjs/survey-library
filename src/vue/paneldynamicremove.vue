<template>
  <input
    type="button"
    v-show="!isCollapsed"
    v-if="question.canRemovePanel && !question.isReadOnly"
    :class="question.getPanelRemoveButtonCss()"
    :value="question.panelRemoveText"
    @click="removePanelClick(panel)"
  />
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
    var self = this;
    this.panel.registerFunctionOnPropertyValueChanged(
      "state",
      function(val: any) {
        self.isCollapsed = self.panel.isCollapsed;
      },
      "button"
    );
  }
  beforeDestroy() {
    this.panel.unRegisterFunctionOnPropertyValueChanged("state", "button");
  }
  removePanelClick(panel: any) {
    this.question.removePanelUI(panel);
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
