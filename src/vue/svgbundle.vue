<template>
  <svg id="sv-icon-holder-global-container" ref="root" v-show="false"></svg>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { SvgRegistry } from "survey-core";

@Component
export class SvgBundle extends Vue {
  mounted() {
    this.$el.innerHTML = SvgRegistry.iconsRenderedHtml();
  }
}

Vue.component("sv-svg-bundle", SvgBundle);
export default SvgBundle;
</script>
