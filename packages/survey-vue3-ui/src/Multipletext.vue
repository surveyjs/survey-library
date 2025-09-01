<template>
  <table :class="question.getQuestionRootCss()" ref="root">
    <tbody>
      <template
        v-for="(row, rowIndex) in question.getRows()"
        :key="question.inputId + 'rowkey' + rowIndex"
      >
        <SvComponent :is="'sv-multipletext-row'" :question="question" :row="row"></SvComponent>
      </template>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionMultipleTextModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionMultipleTextModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
