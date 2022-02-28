<template>
  <div :class="question.cssClasses.root">
    <img
      v-if="question.renderedMode === 'image'"
      :class="question.getImageCss()"
      :src="question.imageLink"
      :alt="question.text || question.title"
      :width="question.renderedWidth"
      :height="question.renderedHeight"
      v-bind:style="{ objectFit: question.imageFit }"
    /><video
      controls
      v-if="question.renderedMode === 'video'"
      :class="question.getImageCss()"
      :src="question.imageLink"
      :width="question.renderedWidth"
      :height="question.renderedHeight"
      v-bind:style="{ objectFit: question.imageFit }"
    ></video>
    <iframe
      v-if="question.renderedMode === 'youtube'"
      :class="question.getImageCss()"
      :src="question.imageLink"
      :width="question.renderedWidth"
      :height="question.renderedHeight"
      v-bind:style="{ objectFit: question.imageFit }"
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
