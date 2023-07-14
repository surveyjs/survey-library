<template>
  <survey-panel :question="contentPanel" :css="css" />
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { QuestionCompositeModel } from "survey-core";
import { QuestionVue } from "./base";

export default defineComponent({
  props: {
    question: {
      type: Object as PropType<QuestionCompositeModel>,
      required: true,
    },
    css: Object,
  },
  mixins: [QuestionVue],
  computed: {
    contentPanel() {
      return this.question.contentPanel;
    },
  },
});
</script>
