<script setup lang="ts">
import { StylesManager } from 'survey-core';
import TestCommon from './TestCommon.vue';
import * as SurveyCore from "survey-core";
import * as widgets from "surveyjs-widgets";
import ("icheck");
import ("icheck/skins/flat/green.css");
import ("icheck/skins/square/blue.css");
import ("survey-core/survey.css")
StylesManager.applyTheme("default");
widgets.sortablejs(SurveyCore);
widgets.icheck(SurveyCore, (window as any).jQuery);
</script>
<template>
<TestCommon></TestCommon>
</template>