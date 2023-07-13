<template>
    <div :class="question.cssClasses.root">
    <img
      v-if="question.renderedMode === 'image'"
      v-show="question.imageLink && !question.contentNotLoaded"
      :class="question.getImageCss()"
      :src="question.locImageLink.renderedHtml"
      :alt="question.altText || question.title"
      :width="question.renderedWidth"
      :height="question.renderedHeight"
      v-bind:style="{ objectFit: question.imageFit,  width: question.renderedStyleWidth, height: question.renderedStyleHeight }"
      @load="(event) => { question.onLoadHandler() }"
      @error="(event) => { question.onErrorHandler() }"
    /><video
      controls
      v-if="question.renderedMode === 'video'"
      v-show="question.imageLink && !question.contentNotLoaded"
      :class="question.getImageCss()"
      :src="question.locImageLink.renderedHtml"
      :width="question.renderedWidth"
      :height="question.renderedHeight"
      v-bind:style="{ objectFit: question.imageFit, width: question.renderedStyleWidth, height: question.renderedStyleHeight }"
      @loadedmetadata="(event) => { question.onLoadHandler() }"
      @error="(event) => { question.onErrorHandler() }"
    ></video>
    <iframe
      v-if="question.renderedMode === 'youtube'"
      :class="question.getImageCss()"
      :src="question.locImageLink.renderedHtml"
      :width="question.renderedWidth"
      :height="question.renderedHeight"
      v-bind:style="{ objectFit: question.imageFit,  width: question.renderedStyleWidth, height: question.renderedStyleHeight }"
    ></iframe>
    <div v-if="!question.imageLink || question.contentNotLoaded"
      :class="question.cssClasses.noImage">
      <sv-svg-icon :iconName="question.cssClasses.noImageSvgIconId" :size="48"></sv-svg-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { QuestionImageModel } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref, type PropType } from "vue";
import { QuestionVue } from "./base";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-image",
  mixins: [QuestionVue],
  props: {
    question: Object as PropType<QuestionImageModel>,
    css: Object,
  },
});

</script>
