<template>
  <div :class="question.cssClasses.videoContainer">
    <SurveyVueComponent
      :name="'sv-action'"
      :item="question.changeCameraAction"
    ></SurveyVueComponent>
    <SurveyVueComponent
      :name="'sv-action'"
      :item="question.closeCameraAction"
    ></SurveyVueComponent>
    <video
      autoplay
      playsinline
      :id="question.videoId"
      :class="question.cssClasses.video"
    ></video>
    <SurveyVueComponent
      :name="'sv-action'"
      :item="question.takePictureAction"
    ></SurveyVueComponent>
  </div>
</template>
<script setup lang="ts">
import type { QuestionFileModel } from "survey-core";
import SurveyVueComponent from "./SurveyVueComponent.vue";
defineProps<{ question: QuestionFileModel }>();
</script>
