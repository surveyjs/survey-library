<template>
  <div v-if="question.isDataSourceAssigned" :class="question.getRecordsContentCss()">
    <div :class="question.cssClasses.recordsBody" :aria-busy="question.isDataLoading ? 'true' : undefined"
      :inert="(question.isDataLoading ? '' : undefined) as any">
      <slot></slot>
    </div>
    <SvComponent v-if="question.isDataLoading" :is="'sv-records-loading-overlay'" :question="question" />
  </div>
  <slot v-else></slot>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import type { QuestionRecordsModel } from "survey-core";

defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionRecordsModel }>();
useBase(() => props.question);
</script>
