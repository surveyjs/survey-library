<template>
  <div
    :class="question.renderCssRoot"
    v-html="question.locHtml.renderedHtml"
  ></div>
</template>

<script lang="ts">
import { QuestionHtmlModel } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref, type PropType } from "vue";
import { QuestionVue } from "./base";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-html",
  mixins: [QuestionVue],
  props: {
    question: Object as PropType<QuestionHtmlModel>,
    css: Object,
  },
});

</script>
