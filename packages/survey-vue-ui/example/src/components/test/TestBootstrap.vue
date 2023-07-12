<script setup lang="ts">
import { StylesManager } from "survey-core";
import ("bootstrap/dist/css/bootstrap.css")
import "survey-core/plugins/bootstrap-integration";
import TestCommon from "./TestCommon.vue";
StylesManager.applyTheme("bootstrap");
</script>
<template>
  <TestCommon></TestCommon>
</template>