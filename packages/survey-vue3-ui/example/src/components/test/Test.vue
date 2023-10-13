<script setup lang="ts">
import * as Survey from "survey-core";
import { RouterView } from 'vue-router'
import $ from 'jquery'
import * as showdown from "showdown"
import { defaultCss } from "survey-core/plugins/bootstrap-integration";

Survey.defaultStandardCss.variables.mobileWidth = undefined as any;
Survey.modernCss.variables.mobileWidth = undefined as any;
(window as any).Survey = Object.assign({}, Survey);
(window as any).Survey.defaultBootstrapCss = defaultCss;
window.jQuery = window.$ = $;
(window as any).showdown = showdown;
</script>
<template>
    <RouterView></RouterView>
</template>
