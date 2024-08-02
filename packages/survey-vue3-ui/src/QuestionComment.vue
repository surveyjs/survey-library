<template>
  <div v-if="question.isReadOnlyRenderDiv()">{{ question.comment }}</div>
  <sv-text-area v-else :model="question.commentTextAreaModel"></sv-text-area>
</template>

<script lang="ts" setup>
import type { Question } from "survey-core";
defineProps<{
  question: Question;
}>();
</script>
