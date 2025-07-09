<template>
  <div :class="question.getCommentAreaCss(true)">
    <div v-if="question.isReadOnlyRenderDiv()">{{ question.getCommentValue(item) }}</div>
    <SvComponent
      :is="'sv-text-area'"
      v-else
      :model="question.getCommentTextAreaModel(item)"
    ></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import type { ItemValue, Question } from "survey-core";
import SvComponent from "./SvComponent.vue";
defineProps<{
  question: Question;
  item: ItemValue
}>();
</script>
