<template>
  <div
    :class="question.cssClasses.root"
    ref="root"
  >
    <img :class="question.cssClasses.background" :id="`imagemap-${question.id}-background`" :src="question.imageLink" />
    <canvas :class="question.cssClasses.canvas.preview" :id="`imagemap-${question.id}-canvas-preview`"></canvas>
    <canvas :class="question.cssClasses.canvas.hover" :id="`imagemap-${question.id}-canvas-hover`"></canvas>
    <canvas :class="question.cssClasses.canvas.selected" :id="`imagemap-${question.id}-canvas-selected`"></canvas>
    <img
      :class="question.cssClasses.map"
      :src="question.imageLink"
      :useMap="`#imagemap-${question.id}`"
    />
    <map :name="`imagemap-${question.id}`"></map>
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
