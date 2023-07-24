<script setup lang="ts">
import { StylesManager } from "survey-core";
import TestCommon from "./TestCommon.vue";
import("survey-core/modern.css");
StylesManager.applyTheme("modern");
</script>
<template>
  <TestCommon id="modernTest"></TestCommon>
</template>
<style module>
</style>