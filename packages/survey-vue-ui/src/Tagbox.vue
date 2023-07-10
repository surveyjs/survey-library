<template>
  <div :class="question.renderCssRoot">
    <sv-tagbox :question="question"></sv-tagbox>
    <survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts">
import { QuestionTagboxModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "survey-tagbox",
  props: {
    question: Object as PropType<QuestionTagboxModel>,
  },
});
</script>
