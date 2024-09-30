<template>
  <div :class="question.cssClasses.rootDropdown" ref="root">
    <SvComponent :is="'sv-dropdown'" :question="question"></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
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
