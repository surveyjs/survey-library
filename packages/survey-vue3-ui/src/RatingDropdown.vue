<template>
  <div :class="question.cssClasses.rootDropdown" ref="root">
    <SurveyVueComponent
      :name="'sv-dropdown'"
      :question="question"
    ></SurveyVueComponent>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
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
