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

  constructor() {
    super();
    if (!this.locString) return;
    const self = this;
    this.locString.onChanged = () => {
      self.$forceUpdate();
    };
    this.locString.onChanged();
  }
}
Vue.component(LocalizableString.defaultRenderer, SurveyStringViewer);
export default SurveyStringViewer;
</script>
