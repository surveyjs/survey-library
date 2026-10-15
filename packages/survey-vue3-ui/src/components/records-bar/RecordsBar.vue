<template>
  <div v-if="model.isVisible" :class="model.cssClasses.root">
    <div v-if="model.showPager" :class="model.cssClasses.pager">
      <SvComponent :is="'sv-action-bar'" :model="model.pagerActions"></SvComponent>
    </div>
    <div v-if="model.showViewActions" :class="model.cssClasses.viewActions">
      <SvComponent :is="'sv-action-bar'" :model="model.viewActions"></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionRecordsBar } from "survey-core";
import { useBase } from "@/base";

// The bar under the records of a dynamic panel and a dynamic matrix: the pager, and the sort menu under it.
const props = defineProps<{ model: QuestionRecordsBar }>();
useBase(() => props.model);
</script>
