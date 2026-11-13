<script lang="ts">
import { RouterView } from 'vue-router'
import * as showdown from "showdown"
import * as Survey from "survey-core";
(window as any).showdown = showdown;
(window as any).Survey = Object.assign({}, Survey);
// The locale bundle is a lazy chunk: only the tests that show a non-English survey load it (e2e/helper.ts).
(window as any).loadSurveyLocales = () => import("survey-core/survey.i18n");
</script>
<script setup lang="ts">
import { SurveyModel } from "survey-core";
import { SurveyComponent, PopupSurveyComponent } from "survey-vue3-ui";
import { shallowRef } from "vue";
const survey = shallowRef();
const isPopup = shallowRef();
const isExpanded = shallowRef();
(window as any).setSurvey = (model: SurveyModel | Survey.PopupSurveyModel, isPopupValue: boolean, isExpandedValue = true) => {
    survey.value = model;
    isPopup.value = isPopupValue;
    isExpanded.value = isExpandedValue;
}
</script>
<template>
    <div id="surveyElement">
        <SurveyComponent v-if="survey && !isPopup" :survey="survey"></SurveyComponent>
        <PopupSurveyComponent v-if="survey && isPopup" :survey="survey" :isExpanded="isExpanded" :allowClose='true' :allowFullScreen='true'>
        </PopupSurveyComponent>
    </div>
    <div id="surveyResultElement"></div>
</template>