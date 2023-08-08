<script setup lang="ts">
  import { Model } from "survey-core";
  import("survey-core/defaultV2.css");
  let survey = new Model({
    elements: [
      {
        type: "text",
        name: "q1"
      }
    ]
  })
</script>

<template>
  <SurveyComponent :survey="survey"></SurveyComponent>
</template>