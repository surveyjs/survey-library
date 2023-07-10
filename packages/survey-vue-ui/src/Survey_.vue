<template>
  <div class="survey">
    <h1>{{ model.title }}</h1>
    <h2>{{ model.description }}</h2>
    <div>{{ model.surveyId }}</div>
  </div>
</template>

<script lang="ts">
import { Model } from "survey-core";
import { defineSurveyComponent } from "./base";
import type { PropType } from "vue";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "Survey",
  props: {
    model: Object as PropType<Model>,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.model; }
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
