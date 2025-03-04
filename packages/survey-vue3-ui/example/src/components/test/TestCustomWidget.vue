<script setup lang="ts">
import TestCommon from './TestCommon.vue';
import * as SurveyCore from "survey-core";
import * as widgets from "surveyjs-widgets";
import ("icheck");
import ("icheck/skins/flat/green.css");
import ("icheck/skins/square/blue.css");
widgets.sortablejs(SurveyCore);
widgets.icheck(SurveyCore, (window as any).jQuery);
import("survey-core/survey-core.css");
</script>
<template>
<TestCommon></TestCommon>
</template>