<script lang="ts" setup>
import { SurveyModel } from "survey-core";
import Survey from "./Survey.vue";

const json = {
  logoPosition: "right",
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "text",
          name: "question1",
        },
        {
          type: "text",
          name: "question2",
          visibleIf: "{question1} notempty",
        },
      ],
    },
  ],
};

const survey = new SurveyModel(json);
</script>

<template>
  <Survey :survey="survey" />
</template>
