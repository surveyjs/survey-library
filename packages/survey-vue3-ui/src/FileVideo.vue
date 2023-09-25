<template>
  <div :class="question.cssClasses.videoContainer">
    <sv-action :item="question.changeCameraAction"></sv-action>
    <sv-action :item="question.closeCameraAction"></sv-action>
    <video
      autoplay
      playsinline
      :id="question.videoId"
      :class="question.cssClasses.video"
    ></video>
    <sv-action :item="question.takePictureAction"></sv-action>
  </div>
</template>
<script setup lang="ts">
import type { QuestionFileModel } from "survey-core";
defineProps<{ question: QuestionFileModel }>();
</script>
