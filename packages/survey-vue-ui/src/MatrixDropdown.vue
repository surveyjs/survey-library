<template>
  <survey-matrixtable :question="question" />
</template>

<script lang="ts">
import { QuestionMatrixDropdownModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "survey-matrixdropdown",
  props: {
    question: QuestionMatrixDropdownModel,
  },
});
</script>
