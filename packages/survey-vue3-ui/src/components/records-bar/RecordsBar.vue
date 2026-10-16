<template>
  <div v-if="model.isVisible" :class="model.cssClasses.root">
    <div :class="model.cssClasses.pager">
      <SvComponent :is="'sv-action-bar'" :model="model.pagerActions"></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionRecordsBar } from "survey-core";
import { useBase } from "@/base";

// The bar under the records of a dynamic panel and of a matrix: the pager.
const props = defineProps<{ model: QuestionRecordsBar }>();
useBase(() => props.model);
</script>
