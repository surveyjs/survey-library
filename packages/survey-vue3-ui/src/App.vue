<script lang="ts">
import { defineComponent } from "vue";
import { SurveyModel, StylesManager } from "survey-core";
import Survey from "./Survey.vue";

const json = {
 "logoPosition": "right",
 "pages": [
  {
   "name": "page1",
   "elements": [
    {
     "type": "maxdiff",
     "name": "panel1",
     "description": "description goes at the top",
     "title": "title above each item",
     "choices": ["a", "b", "c", "d"],
    },
   ]
  }
 ]
};

StylesManager.applyTheme("defaultV2");

//window.survey = new SurveyModel(json);

export default defineComponent({
  name: "App",
  components: {
    Survey,
  },
  data() {
    const survey = new SurveyModel(json);
    (<any>window)["survey"] = survey;
    survey.title = "It works!";
    survey.description = "This is the first survey in Vue3";
    survey.surveyId = "Survey1";
    return {
      survey: survey as any,
    };
  },
});

</script>

<template>
    <survey :survey="survey" />
</template>
