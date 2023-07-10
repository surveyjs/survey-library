<template>
  <div :class="question.cssClasses.rootDropdown">
      <sv-dropdown :question="question" ></sv-dropdown>
  </div>
</template>

<script lang="ts">
import { QuestionRatingModel, RendererFactory } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "sv-rating-dropdown",
  props: {
    question: Object as PropType<QuestionRatingModel>,
  },
});

RendererFactory.Instance.registerRenderer(
  "rating",
  "dropdown",
  "sv-rating-dropdown"
);
</script>
