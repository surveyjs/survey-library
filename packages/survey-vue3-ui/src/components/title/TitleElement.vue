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
      ($event: any) => {
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

<script lang="ts" setup>
import { doKey2ClickUp, type SurveyElementCore } from "survey-core";
defineProps<{
  element: SurveyElementCore;
  css: any;
}>();

const keyup = (event: any) => {
  doKey2ClickUp(event);
};
</script>
