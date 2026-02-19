<script setup lang="ts">
  import { Model } from "survey-core";
  import("survey-core/survey-core.css");
  import { SurveyComponent } from "survey-vue3-ui";
  let survey = new Model({
        elements: [
          {
            type: "boolean",
            name: "slider1",
           // swapOrder: true,
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