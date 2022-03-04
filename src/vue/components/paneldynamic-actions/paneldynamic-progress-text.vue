<template>
    <div :class="question.cssClasses.progressText">{{ question.progressText }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { PaneldynamicAction } from "./paneldynamic-add-btn.vue";

@Component
export class PanelDynamicProgressText extends PaneldynamicAction {
}
Vue.component("sv-paneldynamic-progress-text", PanelDynamicProgressText);
export default PanelDynamicProgressText;
</script>
