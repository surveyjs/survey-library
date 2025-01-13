<template>
  <div ref="root" :class="question.renderCssRoot" v-html="renderedHtml"></div>
</template>

<script lang="ts" setup>
import type { QuestionHtmlModel } from "survey-core";
import { ref } from "vue";
import { useLocString, useQuestion } from "./base";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionHtmlModel }>();
const root = ref(null);
useQuestion(props, root);
const renderedHtml = useLocString(() => props.question.locHtml);
</script>
