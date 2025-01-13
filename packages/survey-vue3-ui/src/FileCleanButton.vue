<template>
  <button type="button" :class="css" @click="question.doClean">
    <span>{{ question.clearButtonCaption }}</span>
    <SvComponent
      :is="'sv-svg-icon'"
      v-if="question.cssClasses.removeButtonIconId"
      :iconName="question.cssClasses.removeButtonIconId"
      :size="'auto'"
      :title="question.clearButtonCaption"
    ></SvComponent>
  </button>
</template>
<script setup lang="ts">
import type { QuestionFileModel } from "survey-core";
import SvComponent from "@/SvComponent.vue";
defineProps<{ question: QuestionFileModel; css: any }>();
</script>
