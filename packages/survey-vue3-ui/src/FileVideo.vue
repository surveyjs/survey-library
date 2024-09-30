<template>
  <div :class="question.cssClasses.videoContainer">
    <SvComponent
      :is="'sv-action'"
      :item="question.changeCameraAction"
    ></SvComponent>
    <SvComponent
      :is="'sv-action'"
      :item="question.closeCameraAction"
    ></SvComponent>
    <video
      autoplay
      playsinline
      :id="question.videoId"
      :class="question.cssClasses.video"
    ></video>
    <SvComponent
      :is="'sv-action'"
      :item="question.takePictureAction"
    ></SvComponent>
  </div>
</template>
<script setup lang="ts">
import type { QuestionFileModel } from "survey-core";
import SvComponent from "./SvComponent.vue";
defineProps<{ question: QuestionFileModel }>();
</script>
