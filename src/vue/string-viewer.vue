<template>
  <span
    :class="className"
    v-if="locString.hasHtml"
    v-html="locString.renderedHtml"
  ></span>
  <span :class="className" v-else>{{ locString.renderedHtml }}</span>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { LocalizableString } from "survey-core";

@Component
export class SurveyStringViewer extends Vue {
  @Prop() locString: LocalizableString;
  className: string;

  constructor() {
    super();
    if (!this.locString) return;
    this.className = this.locString.allowLineBreaks ? "sv-string-viewer sv-string-viewer--multiline" : "sv-string-viewer";
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
