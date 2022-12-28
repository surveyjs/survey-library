<template>
  <div class="sv-skeleton-element" :id="element.id"></div>
</template>

<script lang="ts">
import { SurveyElement, Question, PanelModel } from "survey-core";
import { defineSurveyComponent } from "../base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "sv-skeleton",
  props: {
    element: Object,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.model; }
    }
  }
});
</script>
