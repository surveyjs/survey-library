<template>
  <div :class="question.renderCssRoot">
    <sv-dropdown :question="question"></sv-dropdown>
    <survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts">
import { QuestionDropdownModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "survey-dropdown",
  props: {
    question: Object as PropType<QuestionDropdownModel>,
  },
});
</script>
