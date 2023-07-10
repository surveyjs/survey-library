<template>
  <div
    :class="question.renderCssRoot"
    v-html="question.locHtml.renderedHtml"
  ></div>
</template>

<script lang="ts">
import { QuestionHtmlModel } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-html",
  props: {
    question: Object as PropType<QuestionHtmlModel>,
    css: Object,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.question; },
    }
  }
});

</script>
