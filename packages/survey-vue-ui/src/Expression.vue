<template>
  <div :class="question.cssClasses.text">{{ question.formatedValue }}</div>
</template>

<script lang="ts">
import { QuestionExpressionModel } from "survey-core";
import { defineComponent, type PropType } from "vue";
import { BaseVue } from "./base";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-expression",
  props: {
    question: { type: Object as PropType<QuestionExpressionModel>, required: true },
    css: Object,
  },
  mixins: [BaseVue],
  methods: {
    getModel() { return this.question; }
  },
  mounted() {
    if (this.question) {
      this.question.afterRenderQuestionElement(this.$el as HTMLElement);
    }
  },
  unmounted() {
    if (this.question) {
      this.question.beforeDestroyQuestionElement(this.$el as HTMLElement);
    }
  },
});
</script>
