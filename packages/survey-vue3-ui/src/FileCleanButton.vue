<template>
  <button type="button" :class="css" @click="question.doClean">
    <span>{{ question.clearButtonCaption }}</span>
    <sv-svg-icon
      v-if="question.cssClasses.removeButtonIconId"
      :iconName="question.cssClasses.removeButtonIconId"
      :size="'auto'"
      :title="question.clearButtonCaption"
    ></sv-svg-icon>
  </button>
</template>
<script setup lang="ts">
import type { QuestionFileModel } from "survey-core";
defineProps<{ question: QuestionFileModel; css: any }>();
</script>
