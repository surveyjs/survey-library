<template>
  <div :class="element.cssHeader" @click="clickTitleFunction">
    <h5
      v-if="element.hasTitle"
      :class="element.cssTitle"
      v-bind:aria-label="element.locTitle.renderedHtml"
      v-bind:id="element.ariaTitleId"
      v-bind:tabindex="element.titleTabIndex"
      v-bind:aria-expanded="element.titleAriaExpanded"
      v-on:click="
        () => {
          return element.toggleState();
        }
      "
      v-on:keyup="
        ($event) => {
          keyup($event);
        }
      "
    >
      <component
        :is="element.getTitleComponentName()"
        :element="element"
        :css="css"
      ></component>
    </h5>
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
