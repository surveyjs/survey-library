<template>
  <div role="group" :class="question.cssClasses.root" ref="root">
    <SurveyVueComponent
      :name="'sv-button-group-item'"
      v-for="(item, index) in question.visibleChoices"
      :question="question"
      :key="index"
      :item="item"
      :index="index"
    ></SurveyVueComponent>
  </div>
</template>
<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import type { QuestionButtonGroupModel } from "survey-core";
import { useQuestion } from "..";
import { ref } from "vue";
const props = defineProps<{ question: QuestionButtonGroupModel }>();
const root = ref<HTMLDivElement>();
useQuestion(props, root);
</script>
