<template>
  <table :class="question.cssClasses.root">
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

<script lang="ts">
import { QuestionMultipleTextModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "survey-multipletext",
  props: {
    question: Object as PropType<QuestionMultipleTextModel>,
  },
});
</script>
