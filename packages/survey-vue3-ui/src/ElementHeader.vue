<template>
  <div :class="element.cssHeader" @click="clickTitleFunction">
    <survey-element-title :element="element" :css="css" />
    <div v-if="element.hasDescriptionUnderTitle" v-show="element.hasDescription" :class="element.cssDescription"
      :id="element.ariaDescriptionId">
      <survey-string :locString="element.locDescription" />
    </div>
    <sv-action-bar v-if="element.hasAdditionalTitleToolbar" :model="element.additionalTitleToolbar"></sv-action-bar>
  </div>
</template>

<script lang="ts" setup>
import type { Question, PanelModel } from "survey-core";

const props = defineProps<{ element: Question | PanelModel; css?: any }>();
const clickTitleFunction = (e: any) => {
  if (typeof props.element.clickTitleFunction === "function") {
    props.element.clickTitleFunction(e);
  }
};
</script>
