<template>
  <div :class="page.css">
    <sv-file-item
      v-for="item of page.items"
      :key="item"
      :item="item"
      :question="question"
    ></sv-file-item>
  </div>
</template>
<script lang="ts" setup>
import { useBase } from "@/base";
import type { QuestionFileModel, QuestionFilePage } from "survey-core";

const props = defineProps<{
  page: QuestionFilePage;
  question: QuestionFileModel;
}>();
useBase(() => props.page);
</script>
