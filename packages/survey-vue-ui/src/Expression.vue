<template>
  <div :class="question.cssClasses.text">{{ question.formatedValue }}</div>
</template>

<script lang="ts">
import { QuestionExpressionModel } from "survey-core";
import { defineSurveyComponent } from "./base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-expression",
  props: {
    question: QuestionExpressionModel,
    css: Object,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.question; }
    }
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
  }
});

</script>
