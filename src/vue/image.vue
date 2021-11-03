<template>
  <div :class="question.cssClasses.root">
    <img
      v-if="question.contentMode === 'image'"
      :class="question.cssClasses.image"
      :src="question.imageLink"
      :alt="question.text || question.title"
      :width="question.imageWidth ? question.imageWidth + 'px' : undefined"
      :height="question.imageHeight ? question.imageHeight + 'px' : undefined"
      v-bind:style="{ objectFit: question.imageFit }"
    />
    <video controls
      v-if="question.contentMode === 'video'"
      :class="question.cssClasses.image"
      :src="question.imageLink"
      :width="question.imageWidth ? question.imageWidth + 'px' : undefined"
      :height="question.imageHeight ? question.imageHeight + 'px' : undefined"
      v-bind:style="{ objectFit: question.imageFit }"
    ></video>
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
