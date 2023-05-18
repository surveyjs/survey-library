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
import { defineQuestionComponent } from "./base";

export default defineQuestionComponent({
  // eslint-disable-next-line
  name: "survey-text",
  props: {
    question: QuestionTextModel,
    css: Object,
  },
});

</script>
