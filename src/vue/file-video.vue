<template>
  <div :class="question.cssClasses.videoContainer">
    <sv-action :item="question.changeCameraAction"></sv-action>
    <sv-action :item="question.closeCameraAction"></sv-action>
    <video autoplay playsinline
      :id="question.videoId"
      :class="question.cssClasses.video"
    ></video>
    <sv-action :item="question.takePictureAction"></sv-action>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { QuestionFileModel } from "survey-core";
@Component
export class FileVideo extends Vue {
  @Prop() question: QuestionFileModel;
}
Vue.component("sv-file-video", FileVideo);
export default FileVideo;
</script>
