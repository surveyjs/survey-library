<script setup lang="ts">
import { RouterView } from 'vue-router'
import $ from 'jquery'
import * as showdown from "showdown"
import * as Survey from "survey-core";
(window as any).jQuery = (window as any).$ = $;
(window as any).showdown = showdown;
(window as any).Survey = Object.assign({}, Survey);
</script>
<template>
    <RouterView></RouterView>
</template>
