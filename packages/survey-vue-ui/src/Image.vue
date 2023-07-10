<template>
  <div :class="question.cssClasses.root">
    <img
      v-if="question.renderedMode === 'image'"
      :class="question.getImageCss()"
      :src="question.locImageLink.renderedHtml"
      :alt="question.altText || question.title"
      :width="question.renderedWidth"
      :height="question.renderedHeight"
      v-bind:style="{ objectFit: question.imageFit }"
    /><video
      controls
      v-if="question.renderedMode === 'video'"
      :class="question.getImageCss()"
      :src="question.locImageLink.renderedHtml"
      :width="question.renderedWidth"
      :height="question.renderedHeight"
      v-bind:style="{ objectFit: question.imageFit }"
    ></video>
    <iframe
      v-if="question.renderedMode === 'youtube'"
      :class="question.getImageCss()"
      :src="question.locImageLink.renderedHtml"
      :width="question.renderedWidth"
      :height="question.renderedHeight"
      v-bind:style="{ objectFit: question.imageFit }"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { QuestionImageModel } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-image",
  props: {
    question: Object as PropType<QuestionImageModel>,
    css: Object,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.question; },
    }
  }
});

</script>
