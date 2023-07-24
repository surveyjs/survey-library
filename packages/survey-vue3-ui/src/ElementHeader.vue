<template>
  <div :class="element.cssHeader" @click="clickTitleFunction">
    <survey-element-title :element="element" :css="css" />
    <div
      v-if="element.hasDescriptionUnderTitle"
      v-show="element.hasDescription"
      :class="element.cssDescription"
    >
      <survey-string :locString="element.locDescription" />
    </div>
    <sv-action-bar
      v-if="!!element.additionalTitleToolbar"
      :model="element.additionalTitleToolbar"
    ></sv-action-bar>
  </div>
</template>

<script lang="ts" setup>
import type { Question, PanelModel } from "survey-core";

const props = defineProps<{ element: Question | PanelModel; css?: any }>();
const clickTitleFunction = () => {
  if (typeof props.element.clickTitleFunction === "function") {
    props.element.clickTitleFunction();
  }
};
</script>
