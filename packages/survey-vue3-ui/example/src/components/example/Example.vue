<script setup lang="ts">
  import { Model } from "survey-core";
  import("survey-core/survey-core.css");
  import { SurveyComponent } from "survey-vue3-ui";
  let survey = new Model({
  "elements": [
    {
      "type": "radiogroup",
      "name": "car",
      "title": "Which is the brand of your car?",
      "isRequired": true,
      "showNoneItem": true,
      "showOtherItem": true,
      "colCount": 2,
      "choices": [
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota"
      ],
      "separateSpecialChoices": true,
      "allowClear": true
    }
  ]
})
</script>

<template>
  <SurveyComponent :survey="survey"></SurveyComponent>
</template>