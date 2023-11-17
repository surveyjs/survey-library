<template>
  <div :class="question.cssClasses.rootDropdown" ref="root">
    <sv-dropdown :question="question"></sv-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useQuestion } from "./base";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionRatingModel }>();
const root = ref(null);
useQuestion(props, root);
</script>

<script lang="ts">
import { QuestionRatingModel, RendererFactory } from "survey-core";
RendererFactory.Instance.registerRenderer(
  "rating",
  "dropdown",
  "sv-rating-dropdown"
);
</script>
