<script setup lang="ts">
  import { Model } from "survey-core";
  import("survey-core/survey-core.css");
  import { SurveyComponent } from "survey-vue3-ui";
  let survey = new Model({
      elements: [
        {
          name: "name",
          type: "file",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    })
</script>

<template>
  <SurveyComponent :survey="survey"></SurveyComponent>
</template>