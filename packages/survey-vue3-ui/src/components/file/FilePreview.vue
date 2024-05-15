<template>
  <div
    v-if="question.showPreviewContainer"
    :class="question.cssClasses.fileList || undefined"
  >
    <template v-if="question.supportFileNavigator">
      <sv-file-page
        v-for="page in question.renderedPages"
        :key="page.id"
        :page="page"
        :question="question"
      ></sv-file-page>
    </template>
    <template v-if="!question.supportFileNavigator">
      <sv-file-item
        v-for="item in question.previewValue"
        :key="item"
        :item="item"
        :question="question"
      ></sv-file-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { QuestionFileModel } from "survey-core";
defineProps<{ question: QuestionFileModel }>();
</script>
