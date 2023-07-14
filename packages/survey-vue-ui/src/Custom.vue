<template>
  <component
    :is="getComponentName(contentQuestion)"
    :question="contentQuestion"
    :css="css"
  />
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Question, QuestionCustomModel } from "survey-core";
import { getComponentName, QuestionVue } from "./base";

export default defineComponent({
  props: {
    question: {
      type: Object as PropType<QuestionCustomModel>,
      required: true,
    },
    css: Object,
  },
  mixins: [QuestionVue],
  computed: {
    contentQuestion(): Question {
      return this.question.contentQuestion;
    },
  },
  methods: {
    getComponentName(element: Question): string {
      return getComponentName(element);
    },
  },
});
</script>
