<template>
  <div
    :class="question.renderCssRoot"
    v-html="renderedHtml"
  ></div>
</template>

<script lang="ts">
import { QuestionHtmlModel } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref, type PropType } from "vue";
import { QuestionVue, useLocString } from "./base";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-html",
  mixins: [QuestionVue],
  props: {
    question: { type: Object as PropType<QuestionHtmlModel>, required: true },
    css: Object,
  },
  setup(props) {
    return {
      renderedHtml: useLocString(() => props.question.locHtml),
    };
  },
});

</script>
