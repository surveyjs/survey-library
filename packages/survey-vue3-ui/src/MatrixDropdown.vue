<template>
  <SvComponent :is="'survey-matrixtable'" :question="question" ref="root" />
  <SvComponent :is="'sv-records-bar'" :model="question.recordsBar"></SvComponent>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionMatrixDropdownModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionMatrixDropdownModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
