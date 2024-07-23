<script setup lang="ts">
  import { Model } from "survey-core";
  import("survey-core/defaultV2.css");
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