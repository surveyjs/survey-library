<script setup lang="ts">
import { SurveyModel } from "survey-core";
import * as Survey from "survey-core"
import "survey-core/survey.i18n";
import { shallowRef } from "vue";
const survey = shallowRef();
(window as any).setSurvey = (model: SurveyModel | Survey.PopupSurveyModel, isPopup: boolean) => {
    survey.value = model;
}
</script>
<template>
    <SurveyRoot v-if="survey" :survey="survey"></SurveyRoot>
</template>