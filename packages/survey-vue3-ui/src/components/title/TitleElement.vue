<template>
  <component
    v-if="element.hasTitle"
    :is="element.titleTagName"
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
    <SvComponent
      :name="'survey-element-title-content'"
      v-if="!element.hasTitleActions"
      :element="element"
      :css="css"
    ></SvComponent>
    <SvComponent
      :name="'sv-title-actions'"
      v-if="element.hasTitleActions"
      :element="element"
      :css="css"
    ></SvComponent>
  </component>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { doKey2ClickUp, type SurveyElementCore } from "survey-core";
defineProps<{
  element: SurveyElementCore;
  css: any;
}>();

const keyup = (event: any) => {
  doKey2ClickUp(event);
};
</script>
