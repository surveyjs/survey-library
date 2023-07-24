<template>
  <table :class="question.cssClasses.root" ref="root">
    <tbody>
      <tr
        v-for="(row, rowindex) in question.getRows()"
        :key="question.inputId + 'rowkey' + rowindex"
        :class="question.cssClasses.row"
      >
          <td v-for="item in row" :key="'item' + item.editor.id" :class="question.cssClasses.cell">
            <survey-multipletext-item :question="question" :item="item"></survey-multipletext-item>
          </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import type { QuestionMultipleTextModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
const props = defineProps<{ question: QuestionMultipleTextModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
