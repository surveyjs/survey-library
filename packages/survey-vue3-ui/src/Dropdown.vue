<template>
  <div :class="question.renderCssRoot" ref="root">
    <sv-dropdown :question="question"></sv-dropdown>
    <survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts" setup>
import type { QuestionDropdownModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionDropdownModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
