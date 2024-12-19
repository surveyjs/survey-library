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
      :is="'sv-svg-icon'"
      v-if="!element.isExpanded && element.getCssTitleExpandableSvg()"
      :class="element.getCssTitleExpandableSvg()"
      :iconName="'icon-expand-16x16'"
      size="'auto'"
    ></SvComponent>
    <SvComponent
      :is="'sv-svg-icon'"
      v-if="element.isExpanded && element.getCssTitleExpandableSvg()"
      :class="element.getCssTitleExpandableSvg()"
      :iconName="'icon-collapse-16x16'"
      size="'auto'"
    ></SvComponent>
    <SvComponent
      :is="'survey-element-title-content'"
      v-if="!element.hasTitleActions"
      :element="element"
      :css="css"
    ></SvComponent>
    <SvComponent
      :is="'sv-title-actions'"
      v-if="element.hasTitleActions"
      :element="element"
      :css="css"
    ></SvComponent>
  </component>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { doKey2ClickUp, type SurveyElement } from "survey-core";
defineProps<{
  element: SurveyElement;
  css: any;
}>();

const keyup = (event: any) => {
  doKey2ClickUp(event);
};
</script>
