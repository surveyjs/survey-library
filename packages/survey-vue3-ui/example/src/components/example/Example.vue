<script setup lang="ts">
  import { Model } from "survey-core";
  import("survey-core/survey-core.css");
  import { SurveyComponent } from "survey-vue3-ui";
  let survey = new Model({
        elements: [
          {
            type: "slider",
            name: "slider1",
            min: -2,
            max: 2,
            step: 1,
            labelCount: 5
          },
          {
            type: "slider",
            name: "slider2",
            min: -2,
            max: 2,
            step: 1,
            labelCount: 5
          }
        ]
      })
</script>

<template>
  <SurveyComponent :survey="survey"></SurveyComponent>
</template>