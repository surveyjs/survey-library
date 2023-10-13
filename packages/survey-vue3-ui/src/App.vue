<script lang="ts">
import { defineComponent } from "vue";
import { SurveyModel, StylesManager } from "survey-core";
import Survey from "./Survey.vue";

const json = {
  showProgressBar: "both",
  description: "Survey Description",
  title: "Survey New Design Test",
  logo: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
  logoPosition: "left",
  questions: [
    {
      type: "file",
      name: "q1",
      mode: "both"
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
