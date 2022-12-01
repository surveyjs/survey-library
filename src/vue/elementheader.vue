<template>
  <div :class="element.cssHeader" @click="clickTitleFunction">
    <survey-element-title :element="element" :css="css"/>
    <div
      v-if="element.hasDescriptionUnderTitle"
      :class="element.cssDescription"
    >
      <survey-string :locString="element.locDescription" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyElement, Question, PanelModel, doKey2ClickUp } from "survey-core";

@Component
export class ElementHeader extends Vue {
  @Prop() element: Question | PanelModel;
  @Prop() css: any;
  
  clickTitleFunction() {
    if(typeof (<any>this.element).clickTitleFunction === "function") {
      (<any>this.element).clickTitleFunction();
    }
  }
}
Vue.component("survey-element-header", ElementHeader);
export default ElementHeader;
</script>
