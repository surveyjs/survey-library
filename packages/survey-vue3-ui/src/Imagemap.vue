<template>
  <div
    :class="question.cssClasses.root"
    ref="root"
  >
    <img :class="question.cssClasses.bg" :id="`${question.id}-bg`" :src="question.imageLink" role="presentation"/>
    <svg :class="question.cssClasses.svg" :id="`${question.id}-svg`"></svg>
  </div>
</template>

<script setup lang="ts">
  import type { QuestionImageMapModel } from "survey-core";
  import { useQuestion } from "./base";
  import { ref } from "vue";
  defineOptions({
    inheritAttrs: false,
  });
  const props = defineProps<{
    question: QuestionImageMapModel;
  }>();
  const root = ref(null);
  useQuestion<QuestionImageMapModel>(props, root);
</script>
