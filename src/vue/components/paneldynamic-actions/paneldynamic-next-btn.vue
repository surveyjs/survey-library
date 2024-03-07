<template>
  <div :title="question.panelNextText" @click="nextPanelClick" :class="question.getNextButtonCss()">
    <sv-svg-icon :iconName="question.cssClasses.progressBtnIcon" :size="'auto'"></sv-svg-icon>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { PaneldynamicAction } from "./paneldynamic-add-btn.vue";

@Component
export class PanelDynamicNextBtn extends PaneldynamicAction {
  nextPanelClick() {
    this.question.goToNextPanel();
  }
}
Vue.component("sv-paneldynamic-next-btn", PanelDynamicNextBtn);
export default PanelDynamicNextBtn;
</script>
