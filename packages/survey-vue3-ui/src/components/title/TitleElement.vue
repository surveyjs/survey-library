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
   <span :class="element.getCssTitleExpandableSvgContainer()" v-if="element.showTitleExpandableSvg">
    <SvComponent
      :is="'sv-svg-icon'"
      :class="element.getCssTitleExpandableSvg()"
      :iconName="element.titleExpandableSvgIconName"
      size="'auto'"
    ></SvComponent>
   </span>
    <SvComponent
      :is="'survey-element-title-content'"
      v-if="!element.hasTitleActions"
      :element="element"
      :css="css"
    ></SvComponent>
    <SvComponent
      :is="'sv-title-actions'"
      v-if="needRenderActions"
      :element="element"
      :css="css"
    ></SvComponent>
  </component>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { doKey2ClickUp, type SurveyElement } from "survey-core";
import { computed } from "vue";

const props = defineProps<{
  element: SurveyElement;
  renderActions?: any;
  css: any;
}>();

const needRenderActions = computed(() => {
  return props.element.hasTitleActions && props.renderActions !== false;
});
const keyup = (event: any) => {
  doKey2ClickUp(event);
};
</script>
