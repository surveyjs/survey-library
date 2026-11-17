<script setup lang="ts">
import TestCommon from "./TestCommon.vue";
import { DefaultLightPanelless } from "survey-core/themes";
import "survey-core/rich-text";
import "survey-core/rich-text.css";
(window as any).SurveyTheme = (window as any).SurveyTheme || {}; 
(window as any).SurveyTheme.DefaultLightPanelless = DefaultLightPanelless;
import("survey-core/survey-core.css");
</script>
<template>
  <TestCommon></TestCommon>
</template>