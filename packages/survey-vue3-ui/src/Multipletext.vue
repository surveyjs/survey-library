<template>
  <table :class="question.getQuestionRootCss()" ref="root">
    <tbody>
      <template
        v-for="(row, rowIndex) in rows"
        :key="question.inputId + 'rowkey' + rowIndex"
      >
        <tr :class="question.cssClasses.row" v-if="row.isVisible">
          <td
            v-for="cell in row.cells"
            :key="'item' + cell.item.editor.id"
            :class="cell.className"
          >
            <survey-multipletext-item
              :question="question"
              :cell="cell"
            ></survey-multipletext-item>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import type { QuestionMultipleTextModel } from "survey-core";
import { useComputedArray, useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionMultipleTextModel }>();
const root = ref(null);
const rows = useComputedArray(() => props.question.getRows());
useQuestion(props, root);
</script>
