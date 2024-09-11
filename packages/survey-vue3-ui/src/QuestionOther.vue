<template>
  <div :class="question.getCommentAreaCss(true)">
    <div v-if="question.isReadOnlyRenderDiv()">{{ question.otherValue }}</div>
    <SvComponent
      :is="'sv-text-area'"
      v-else
      :model="question.otherTextAreaModel"
    ></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import type { Question } from "survey-core";
import SvComponent from "./SvComponent.vue";
defineProps<{
  question: Question;
}>();
</script>
