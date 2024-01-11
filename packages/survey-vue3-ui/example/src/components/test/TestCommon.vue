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
        <SurveyComponent v-if="survey && !isPopup" :survey="survey"></SurveyComponent>
        <PopupSurveyComponent v-if="survey && isPopup" :survey="survey" :isExpanded='true' :allowClose='true'
            :closeOnCompleteTimeout='-1'></PopupSurveyComponent>
    </div>
    <div id="surveyResultElement"></div>
</template>