<template>
  <button type="button" :class="css" @click="question.doClean">
    <span>{{ question.clearButtonCaption }}</span>
    <sv-svg-icon
      v-if="question.cssClasses.removeButtonIconId"
      :iconName="question.cssClasses.removeButtonIconId"
      :size="'auto'"
      :title="question.clearButtonCaption"
    ></sv-svg-icon>
  </button>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { QuestionFileModel } from "survey-core";
@Component
export class FileCleanButton extends Vue {
  @Prop() question: QuestionFileModel;
  @Prop() css: any;
}
Vue.component("sv-file-clean-btn", FileCleanButton);
export default FileCleanButton;
</script>