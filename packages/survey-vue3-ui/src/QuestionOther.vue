<template>
  <div :class="question.getCommentAreaCss(true)">
    <div v-if="question.isReadOnlyRenderDiv()">{{ question.otherValue }}</div>
    <sv-text-area v-else :model="question.otherTextAreaModel"></sv-text-area>
  </div>
</template>

<script lang="ts" setup>
import type { Question } from "survey-core";

defineProps<{
  question: Question;
}>();
</script>
