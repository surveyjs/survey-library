<template>
  <button type="button" :class="css" @click="question.doClean">
    <span>{{ question.clearButtonCaption }}</span>
    <SurveyVueComponent
      :name="'sv-svg-icon'"
      v-if="question.cssClasses.removeButtonIconId"
      :iconName="question.cssClasses.removeButtonIconId"
      :size="'auto'"
      :title="question.clearButtonCaption"
    ></SurveyVueComponent>
  </button>
</template>
<script setup lang="ts">
import type { QuestionFileModel } from "survey-core";
import SurveyVueComponent from "@/SurveyVueComponent.vue";
defineProps<{ question: QuestionFileModel; css: any }>();
</script>
