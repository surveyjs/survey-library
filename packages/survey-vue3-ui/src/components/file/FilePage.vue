<template>
  <div :class="page.css" :id="page.id">
    <SvComponent
      :is="'sv-file-item'"
      v-for="item of page.items"
      :key="item"
      :item="item"
      :question="question"
    ></SvComponent>
  </div>
</template>
<script lang="ts" setup>
import { useBase } from "@/base";
import SvComponent from "@/SvComponent.vue";
import type { QuestionFileModel, QuestionFilePage } from "survey-core";

const props = defineProps<{
  page: QuestionFilePage;
  question: QuestionFileModel;
}>();
useBase(() => props.page);
</script>
