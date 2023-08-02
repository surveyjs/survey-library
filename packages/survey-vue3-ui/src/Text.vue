<template>
  <div v-if="question.isReadOnlyRenderDiv()" ref="root">
    {{ question.value }}
  </div>
  <div v-else-if="question.dataListId" ref="root">
    <survey-text-input :question="question" />
    <datalist :id="question.dataListId">
      <option v-for="item in question.dataList" :value="item"></option>
    </datalist>
  </div>
  <survey-text-input v-else :question="question" ref="root" />
</template>

<script lang="ts" setup>
import type { QuestionTextModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
const props = defineProps<{ question: QuestionTextModel }>();
const root = ref(null);
useQuestion<QuestionTextModel>(props, root);
</script>
