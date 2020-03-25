<template>
  <div :class="question.cssClasses.root">
    <img
      v-if="question.contentMode === 'image'"
      :class="question.cssClasses.image"
      :src="question.imageLink"
      :width="question.imageWidth ? question.imageWidth + 'px' : undefined"
      :height="question.imageHeight ? question.imageHeight + 'px' : undefined"
      v-bind:style="{ objectFit: question.imageFit }"
    />
    <embed
      v-if="question.contentMode === 'video'"
      :class="question.cssClasses.image"
      :src="question.imageLink"
      :width="question.imageWidth ? question.imageWidth + 'px' : undefined"
      :height="question.imageHeight ? question.imageHeight + 'px' : undefined"
      v-bind:style="{ objectFit: question.imageFit }"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { QuestionImageModel } from "../question_image";

@Component
export class Image extends Vue {
  @Prop question: QuestionImageModel;
  @Prop css: any;
}
Vue.component("survey-image", Image);
export default Image;
</script>
