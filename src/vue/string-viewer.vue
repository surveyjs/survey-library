<template>
  <span
    class="sv-string-viewer"
    v-if="locString.hasHtml"
    v-html="locString.renderedHtml"
  ></span>
  <span class="sv-string-viewer" v-else>{{ locString.renderedHtml }}</span>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { LocalizableString } from "survey-core";

@Component
export class SurveyStringViewer extends Vue {
  @Prop() locString: LocalizableString;
}
Vue.component(LocalizableString.defaultRenderer, SurveyStringViewer);
export default SurveyStringViewer;
</script>
