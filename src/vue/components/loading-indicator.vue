<template>
  <div class="sd-loading-indicator">
    <sv-svg-icon :iconName="'icon-loading'" size="'auto'"></sv-svg-icon>
  </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";

@Component
export class LoadingIndicatorComponent extends Vue {}

Vue.component("sv-loading-indicator", LoadingIndicatorComponent);
export default LoadingIndicatorComponent;
</script>
