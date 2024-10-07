<template>
  <div
    v-if="question.showPreviewContainer"
    :class="question.cssClasses.fileList || undefined"
  >
    <template v-if="question.supportFileNavigator">
      <SvComponent
        :is="'sv-file-page'"
        v-for="page in question.renderedPages"
        :key="page.id"
        :page="page"
        :question="question"
      ></SvComponent>
    </template>
    <template v-if="!question.supportFileNavigator">
      <SvComponent
        :is="'sv-file-item'"
        v-for="item in question.previewValue"
        :key="item"
        :item="item"
        :question="question"
      ></SvComponent>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { QuestionFileModel } from "survey-core";
import SvComponent from "@/SvComponent.vue";
defineProps<{ question: QuestionFileModel }>();
</script>
