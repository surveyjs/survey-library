<template>
  <div :class="question.cssClasses.root">
    <img
      v-if="question.renderedMode === 'image'"
      :class="question.cssClasses.image"
      :src="question.imageLink"
      :alt="question.text || question.title"
      v-bind:style="{
        objectFit: question.imageFit,
        width: question.renderedWidth,
        height: question.renderedHeight,
      }"
    /><video
      controls
      v-if="question.renderedMode === 'video'"
      :class="question.cssClasses.image"
      :src="question.imageLink"
      v-bind:style="{
        objectFit: question.imageFit,
        width: question.renderedWidth,
        height: question.renderedHeight,
      }"
    ></video>
    <iframe
      v-if="question.renderedMode === 'youtube'"
      :class="question.cssClasses.image"
      :src="question.imageLink"
      v-bind:style="{
        objectFit: question.imageFit,
        width: question.renderedWidth,
        height: question.renderedHeight,
      }"
    ></iframe>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { QuestionImageModel } from "survey-core";

@Component
export class QuestionImage extends Vue {
  @Prop() question: QuestionImageModel;
  @Prop() css: any;
}
Vue.component("survey-image", QuestionImage);
export default QuestionImage;
</script>
