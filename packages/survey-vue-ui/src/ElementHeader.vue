<template>
  <div :class="element.cssHeader" @click="clickTitleFunction">
    <survey-element-title :element="element" :css="css"/>
    <div
      v-if="element.hasDescriptionUnderTitle"
      v-show="element.hasDescription"
      :class="element.cssDescription"
    >
      <survey-string :locString="element.locDescription" />
    </div>
    <sv-action-bar v-if=!!element.additionalTitleToolbar :model="element.additionalTitleToolbar"></sv-action-bar>
  </div>
</template>

<script lang="ts">
import { SurveyElement, Question, PanelModel, doKey2ClickUp } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-brand-info",
  props: {
    element: { type: Object, required: true },
    css: Object,
  },
  methods: {
    clickTitleFunction() {
      if(typeof (this.element).clickTitleFunction === "function") {
        (this.element).clickTitleFunction();
      }
    },
  },
});
</script>
