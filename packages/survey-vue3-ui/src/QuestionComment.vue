<template>
  <div v-if="question.isReadOnlyRenderDiv()">{{ question.comment }}</div>

  <SvComponent
    :is="'sv-text-area'"
    v-else
    :model="question.commentTextAreaModel"
  ></SvComponent>
</template>

<script lang="ts" setup>
import SvComponent from "./SvComponent.vue";
import type { Question } from "survey-core";
defineProps<{
  question: Question;
}>();
</script>
