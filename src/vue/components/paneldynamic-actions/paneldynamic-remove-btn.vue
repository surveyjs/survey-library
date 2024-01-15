<template>
  <button
    type="button"
    :class="question.getPanelRemoveButtonCss()"
    @click="removePanelClick(panel)"
  >
    <span :class="question.cssClasses.buttonRemoveText"><survey-string :locString="question.locPanelRemoveText"></survey-string></span>
    <span :class="question.cssClasses.iconRemove"></span>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { PaneldynamicAction } from "./paneldynamic-add-btn.vue";

@Component
export class PanelDynamicRemoveButton extends PaneldynamicAction {
  public get panel() {
    return (this.item && this.item.data.panel) || this.data.panel;
  }
  removePanelClick(panel: any) {
    if (!this.question.isInputReadOnly) {
      this.question.removePanelUI(panel);
    }
  }
}
Vue.component("sv-paneldynamic-remove-btn", PanelDynamicRemoveButton);
export default PanelDynamicRemoveButton;
</script>
