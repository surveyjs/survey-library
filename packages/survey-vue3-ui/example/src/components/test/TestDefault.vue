<script setup lang="ts">
import TestCommon from "./TestCommon.vue";
import { DefaultDarkPanelless, DefaultLightPanelless } from "survey-core/themes";
import "survey-core/rich-text";
(window as any).SurveyTheme = (window as any).SurveyTheme || {}; 
(window as any).SurveyTheme.DefaultLightPanelless = DefaultLightPanelless;
(window as any).SurveyTheme.DefaultDarkPanelless = DefaultDarkPanelless;
import("survey-core/survey-core.css");
</script>
<template>
  <TestCommon></TestCommon>
</template>