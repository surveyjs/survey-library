<template>
  <div :title="question.panelPrevText" @click="prevPanelClick" :class="question.getPrevButtonCss()">
    <sv-svg-icon :iconName="question.cssClasses.progressBtnIcon" :size="'auto'"></sv-svg-icon>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { PaneldynamicAction } from "./paneldynamic-add-btn.vue";

@Component
export class PanelDynamicPrevBtn extends PaneldynamicAction {
  prevPanelClick() {
    this.question.goToPrevPanel();
  }
}
Vue.component("sv-paneldynamic-prev-btn", PanelDynamicPrevBtn);
export default PanelDynamicPrevBtn;
</script>
