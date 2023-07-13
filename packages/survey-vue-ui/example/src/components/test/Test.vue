<script setup lang="ts">
import * as Survey from "survey-core";
import { RouterView } from 'vue-router'
(window as any).Survey = Survey;
import $ from 'jquery'
window.jQuery = window.$ = $
</script>
<template>
    <RouterView></RouterView>
</template>
