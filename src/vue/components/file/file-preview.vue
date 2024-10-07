<template>
  <div
    v-if="question.showPreviewContainer"
    :class="question.cssClasses.fileList || undefined"
  >
      <sv-file-page
        v-if="question.supportFileNavigator"
        v-for="page in question.renderedPages"
        :key="page.id"
        :page="page"
        :question="question"
      ></sv-file-page>
      <sv-file-item
        v-if="!question.supportFileNavigator"
        v-for="item in question.previewValue"
        :key="item"
        :item="item"
        :question="question"
      ></sv-file-item>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { QuestionFileModel } from "survey-core";
@Component
export class FilePreview extends Vue {
  @Prop() question: QuestionFileModel;
}
Vue.component("sv-file-preview", FilePreview);
export default FilePreview;
</script>