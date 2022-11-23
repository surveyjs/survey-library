<template>
  <div class="survey">
    <h1>{{ model.title }}</h1>
  </div>
</template>

<script lang="ts">
import { Model } from "survey-core";
import { defineSurveyComponent } from "../base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "Survey",
  props: {
    model: Model,
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
