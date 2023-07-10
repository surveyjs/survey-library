<template>
  <survey-matrixtable :question="question" />
</template>

<script lang="ts">
import { QuestionMatrixDropdownModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "survey-matrixdropdown",
  props: {
    question: Object as PropType<QuestionMatrixDropdownModel>,
  },
});
</script>
