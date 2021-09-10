<template>
  <div :class="element.cssHeader" @click="clickTitleFunction">
    <survey-element-title :element="element" :css="css"/>
    <div
      v-if="element.hasDescriptionUnderTitle"
      :class="element.cssClasses.description"
    >
      <survey-string :locString="element.locDescription" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyElement, doKey2ClickUp } from "survey-core";

@Component
export class ElementHeader extends Vue {
  @Prop() element: SurveyElement;
  @Prop() css: any;

  keyup(evt: any) {
    doKey2ClickUp(evt);
  }
  clickTitleFunction() {
    if(typeof (<any>this.element).clickTitleFunction === "function") {
      (<any>this.element).clickTitleFunction();
    }
  }
}
Vue.component("survey-element-header", ElementHeader);
export default ElementHeader;
</script>
