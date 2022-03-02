<template>
  <button
    type="button"
    v-if="question.canAddPanel"
    :class="question.getAddButtonCss()"
    @click="addPanelClick"
    >
    <span :class="question.cssClasses.buttonAddText">
      {{ question.panelAddText }}
    </span>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Action, QuestionPanelDynamicModel } from "survey-core";

export class PaneldynamicAction extends Vue {
  @Prop() data: any;
  @Prop() item: Action;
  protected get question(): QuestionPanelDynamicModel {
    return (this.item && this.item.data.question) || this.data.question;
  }
}

@Component
export class PanelDynamicAddBtn extends PaneldynamicAction {
  addPanelClick() {
    this.question.addPanelUI();
  }
}
Vue.component("sv-paneldynamic-add-btn", PanelDynamicAddBtn);
export default PanelDynamicAddBtn;
</script>
