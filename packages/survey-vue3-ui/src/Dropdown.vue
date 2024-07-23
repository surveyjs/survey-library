<template>
  <div :class="question.renderCssRoot" ref="root">
    <SurveyVueComponent
      :name="'sv-dropdown'"
      :question="question"
    ></SurveyVueComponent>
    <SurveyVueComponent
      :name="'survey-other-choice'"
      v-if="question.isOtherSelected"
      :question="question"
    />
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import type { QuestionDropdownModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionDropdownModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
