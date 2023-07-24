<script setup lang="ts">
import { StylesManager } from "survey-core";
import TestCommon from "./TestCommon.vue";
import("survey-core/survey.css");
StylesManager.applyTheme("default");
</script>
<template>
  <TestCommon></TestCommon>
</template>