<template>
  <div v-if="question.isReadOnlyRenderDiv()">{{ question.value }}</div>
  <div v-else-if="question.dataListId">
    <survey-text-input :question="question"/>
    <datalist :id="question.dataListId">
      <option v-for="item in question.dataList" :value="item"></option>
    </datalist>
  </div>
  <survey-text-input v-else :question="question"/>
</template>

<script lang="ts">
import { QuestionTextModel } from "survey-core";
import { defineSurveyComponent } from "../base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-text",
  props: {
    question: QuestionTextModel,
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
