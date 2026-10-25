<template>
  <SvComponent :is="'survey-matrixtable'" :question="question" ref="root" />
  <div v-if="question.showPager" :class="question.cssClasses.footerBar">
    <SvComponent :is="'sv-action-bar'" :model="question.recordsBar.pagerActions"></SvComponent>
  </div>
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
