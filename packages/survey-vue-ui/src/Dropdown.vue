<template>
  <div :class="question.renderCssRoot">
    <sv-dropdown :question="question"></sv-dropdown>
    <survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts">
import { QuestionDropdownModel } from "survey-core";
import { defineQuestionComponent } from "./base";

export default defineQuestionComponent({
  // eslint-disable-next-line
  name: "survey-dropdown",
  props: {
    question: QuestionDropdownModel,
  },
});
</script>
