<template>
  <label
    tabindex="0"
    :class="question.getChooseFileCss()"
    :for="question.inputId"
    v-bind:aria-label="question.chooseButtonText"
    v-key2click
    v-on:click="(event) => { question.chooseFile(event) }"
  >
    <sv-svg-icon
      v-if="question.cssClasses.chooseFileIconId"
      :title="question.chooseButtonText"
      :iconName="question.cssClasses.chooseFileIconId"
      :size="'auto'"
    ></sv-svg-icon>
    <span>{{ question.chooseButtonText }}</span>
  </label>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Action, QuestionFileModel } from "survey-core";

@Component
export class FileChooseButton extends Vue {
  @Prop() data: any;
  @Prop() item: Action;
  get question(): QuestionFileModel {
    return (this.item && this.item.data.question) || this.data.question;
  }
}
Vue.component("sv-file-choose-btn", FileChooseButton);
export default FileChooseButton;
</script>
