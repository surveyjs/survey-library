<script setup lang="ts">
import { SurveyModel } from "survey-core";
import * as Survey from "survey-core"
import "survey-core/survey.i18n";
import { shallowRef } from "vue";
const survey = shallowRef();
const isPopup = shallowRef();
(window as any).setSurvey = (model: SurveyModel | Survey.PopupSurveyModel, isPopupValue: boolean) => {
    survey.value = model;
    isPopup.value = isPopupValue;
}
</script>
<template>
<div id="surveyElement">
    <SurveyRoot v-if="survey && !isPopup" :survey="survey"></SurveyRoot>
    <popup-survey v-if="survey && isPopup" :survey="survey"></popup-survey>
</div>
<div id="surveyResultElement"></div>
</template>