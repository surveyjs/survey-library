<template>
  <div ref="root">
    <div v-if="question.getShowToolbar('top')" :class="question.cssClasses.footer">
      <SvComponent :is="'sv-action-bar'" :model="question.toolbar"></SvComponent>
    </div>
    <SvComponent
      :is="'survey-matrixtable'"
      v-if="question.renderedTable.showTable"
      :question="question"
    />
    <SvComponent
      :is="'survey-placeholder-matrixdynamic'"
      v-else
      :question="question"
    />
    <div v-if="question.getShowToolbar('bottom')" :class="question.cssClasses.footer">
      <SvComponent :is="'sv-action-bar'" :model="question.toolbar"></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { QuestionMatrixDynamicModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
import SvComponent from "@/SvComponent.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionMatrixDynamicModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
