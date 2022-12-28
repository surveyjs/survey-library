<template>
  <div :class="element.cssHeader" @click="clickTitleFunction">
    <survey-element-title :element="element" :css="css"/>
    <div
      v-if="element.hasDescriptionUnderTitle"
      :class="element.cssDescription"
    >
      <survey-string :locString="element.locDescription" />
    </div>
  </div>
</template>

<script lang="ts">
import { SurveyElement, Question, PanelModel, doKey2ClickUp } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-brand-info",
  props: {
    element: Question | PanelModel,
    css: Object,
  },
  data: (vm: any) => {
    return {
      clickTitleFunction: () => {
        if(typeof (vm.element).clickTitleFunction === "function") {
          (vm.element).clickTitleFunction();
        }
      }
    }
  }
});

</script>
