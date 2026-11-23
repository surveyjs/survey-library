<template>
  <div :class="question.cssClasses.recordsLoadingOverlay" role="status" :aria-label="question.loadingIndicatorAriaLabel">
    <SvComponent :is="'sv-loading-indicator'" />
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import type { QuestionRecordsModel } from "survey-core";

defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionRecordsModel }>();
useBase(() => props.question);
</script>
