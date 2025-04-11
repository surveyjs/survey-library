<template>
  <div
    v-if="question.showPreviewContainer"
    :class="question.cssClasses.fileList || undefined"
  >
    <SvComponent
      :is="'sv-file-page'"
      v-for="page in question.renderedPages"
      :key="page.id"
      :page="page"
      :question="question"
    ></SvComponent>
  </div>
</template>

<script setup lang="ts">
import type { QuestionFileModel } from "survey-core";
import SvComponent from "@/SvComponent.vue";
defineProps<{ question: QuestionFileModel }>();
</script>
