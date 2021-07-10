<template>
  <div :class="getHeaderClass(element)" @click="clickTitleFunction">
    <h5
      v-if="element.hasTitle"
      :class="getTitleClass(element)"
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
import { SurveyModel } from "survey-core";
import { IElement, Question, doKey2Click } from "survey-core";

@Component
export class ElementHeader extends Vue {
  @Prop() element: IElement;
  @Prop() css: any;

  beforeDestroy() {
    this.element.stateChangedCallback = null;
  }

  getTitleClass(element: Question) {
    return element.cssTitle;
  }
  getHeaderClass(element: Question) {
    return element.cssHeader;
  }
  keyup(evt: any) {
    doKey2Click(evt);
  }
  get clickTitleFunction(): any {
    return (<any>this.element)["clickTitleFunction"];
  }
}
Vue.component("survey-element-header", ElementHeader);
export default ElementHeader;
</script>
