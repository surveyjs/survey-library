<template>
  <span class="sv-string-editor" contenteditable="true"
    v-if="locString.hasHtml"
    v-html="locString.renderedHtml"
    @blur="onInput"
    @click="onClick"
  ></span>
  <span
    class="sv-string-editor"
    contenteditable="true"
    v-else
    @blur="onInput"
    @click="onClick"
    >{{ locString.renderedHtml }}</span
  >
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { LocalizableString } from "survey-core";

@Component
export class SurveyStringEditor extends Vue {
  @Prop() locString: LocalizableString;

  onInput = (event: any) => {
    this.locString.text = event.target.innerText;
  };
  onClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };
}

Vue.component(LocalizableString.editableRenderer, SurveyStringEditor);
export default SurveyStringEditor;
</script>
