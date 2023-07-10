<script setup lang="ts">
    import { StylesManager, SurveyModel } from "survey-core";
    import * as Survey from "survey-core"
    import "survey-core/survey.i18n";
    import "survey-core/survey.css";
    import { shallowRef } from "vue";
    (window as any).Survey = Survey;
    const survey = shallowRef();
    (window as any).setSurvey = (model: SurveyModel | Survey.PopupSurveyModel, isPopup: boolean) => {
      survey.value = model;
    }
    StylesManager.applyTheme("default");
</script>
<template>
    <SurveyRoot v-if="survey" :survey="survey"></SurveyRoot>
</template>