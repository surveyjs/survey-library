<template>
  <div v-if="question.isReadOnlyRenderDiv()">{{ question.value }}</div>
  <div v-else-if="question.dataListId">
    <survey-text-input :question="question" />
    <datalist :id="question.dataListId">
      <option v-for="item in question.dataList" :value="item"></option>
    </datalist>
  </div>
  <survey-text-input v-else :question="question" />
</template>

<script lang="ts">
import { QuestionTextModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent } from "vue";

export default defineComponent({
  mixins: [QuestionVue],
  // eslint-disable-next-line
  name: "survey-text",
  props: {
    question: QuestionTextModel,
    css: Object,
  },
});

</script>
