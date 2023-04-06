<template>
  <component
    v-if="element.hasTitle"
    v-bind:is="element.titleTagName"
    :class="element.cssTitle"
    v-bind:aria-label="element.titleAriaLabel"
    v-bind:id="element.ariaTitleId"
    v-bind:tabindex="element.titleTabIndex"
    v-bind:aria-expanded="element.titleAriaExpanded"
    v-bind:role="element.titleAriaRole"
    v-on:keyup="
      ($event) => {
        keyup($event);
      }
    "
  >
    <survey-element-title-content
      v-if="!element.hasTitleActions"
      :element="element"
      :css="css"
    ></survey-element-title-content>
    <sv-title-actions
      v-if="element.hasTitleActions"
      :element="element"
      :css="css"
    ></sv-title-actions>
  </component>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyElementCore, doKey2ClickUp } from "survey-core";

@Component
export class TitleElement extends Vue {
  @Prop() element: SurveyElementCore;
  @Prop() css: any;

  keyup(evt: any) {
    doKey2ClickUp(evt);
  }
}
Vue.component("survey-element-title", TitleElement);
export default TitleElement;
</script>
