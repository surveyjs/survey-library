<template>
  <div
    :class="element.cssHeader"
    @click="clickTitleFunction"
    :style="getStyle()"
  >
    <SvComponent :is="'survey-element-title'" :element="element" :css="css" />
    <div
      v-if="element.hasDescriptionUnderTitle"
      v-show="element.hasDescription"
      :class="element.cssDescription"
      :id="element.ariaDescriptionId"
    >
      <SvComponent :is="'survey-string'" :locString="element.locDescription" />
    </div>
    <SvComponent
      :is="'sv-action-bar'"
      v-if="element.hasAdditionalTitleToolbar"
      :model="element.additionalTitleToolbar"
    ></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { Question, PanelModel } from "survey-core";

const props = defineProps<{ element: Question | PanelModel; css?: any }>();
const clickTitleFunction = (e: any) => {
  if (typeof props.element.clickTitleFunction === "function") {
    props.element.clickTitleFunction(e);
  }
};
const getStyle = () => {
  const headerStyle: any = { width: undefined };
  if ("titleWidth" in props.element) {
    headerStyle.width = props.element.titleWidth;
  }
  return headerStyle;
};
</script>
