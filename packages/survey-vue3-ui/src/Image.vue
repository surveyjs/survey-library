<template>
  <div :class="question.cssClasses.root" ref="root">
    <img
      v-if="question.renderedMode === 'image'"
      v-show="imageLink && !question.contentNotLoaded"
      :class="question.getImageCss()"
      :src="imageLink"
      :alt="question.altText || question.title"
      :width="question.renderedWidth"
      :height="question.renderedHeight"
      :style="{
        objectFit: question.imageFit as any,
        width: question.renderedStyleWidth,
        height: question.renderedStyleHeight,
      }"
      @load="
        (event) => {
          question.onLoadHandler();
        }
      "
      @error="
        (event) => {
          question.onErrorHandler();
        }
      "
    /><video
      controls
      v-if="question.renderedMode === 'video'"
      v-show="imageLink && !question.contentNotLoaded"
      :class="question.getImageCss()"
      :src="imageLink"
      :width="question.renderedWidth"
      :height="question.renderedHeight"
      v-bind:style="{
        objectFit: question.imageFit as any,
        width: question.renderedStyleWidth,
        height: question.renderedStyleHeight,
      }"
      @loadedmetadata="
        (event) => {
          question.onLoadHandler();
        }
      "
      @error="
        (event) => {
          question.onErrorHandler();
        }
      "
    ></video>
    <iframe
      v-if="question.renderedMode === 'youtube'"
      :class="question.getImageCss()"
      :src="imageLink"
      :width="question.renderedWidth"
      :height="question.renderedHeight"
      :style="{
        objectFit: question.imageFit as any,
        width: question.renderedStyleWidth,
        height: question.renderedStyleHeight,
      }"
    ></iframe>
    <div
      v-if="!imageLink || question.contentNotLoaded"
      :class="question.cssClasses.noImage"
    >
      <sv-svg-icon
        :iconName="question.cssClasses.noImageSvgIconId"
        :size="48"
      ></sv-svg-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { QuestionImageModel } from "survey-core";
import { useLocString, useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionImageModel }>();
const root = ref(null);
useQuestion(props, root);
const imageLink = useLocString(() => props.question.locImageLink);
</script>
