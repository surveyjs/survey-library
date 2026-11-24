<script setup lang="ts">
import TestCommon from './TestCommon.vue';
import * as SurveyCore from "survey-core";
import * as widgets from "surveyjs-widgets";
import $ from 'jquery'
// icheck is a jQuery plugin that reads window.jQuery when it is loaded, and the jQuery module build sets no global.
(window as any).jQuery = (window as any).$ = $;
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