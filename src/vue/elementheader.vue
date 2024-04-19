<template>
  <div :class="element.cssHeader" @click="clickTitleFunction">
    <survey-element-title :element="element" :css="css" />
    <div v-if="element.hasDescriptionUnderTitle" v-show="element.hasDescription" :class="element.cssDescription"
      :id="element.ariaDescriptionId">
      <survey-string :locString="element.locDescription" />
    </div>
    <sv-action-bar v-if=element.hasAdditionalTitleToolbar :model="element.additionalTitleToolbar"></sv-action-bar>
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

  clickTitleFunction(e: any) {
    if(typeof (<any>this.element).clickTitleFunction === "function") {
      (<any>this.element).clickTitleFunction(e);
    }
  }
}
Vue.component("survey-element-header", ElementHeader);
export default ElementHeader;
</script>
