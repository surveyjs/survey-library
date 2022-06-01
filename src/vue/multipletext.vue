<template>

  <table :class="question.cssClasses.root">
    <tbody>
      <tr
        v-for="(row, rowindex) in question.getRows()"
        :key="question.inputId + 'rowkey' + rowindex"
        :class="question.cssClasses.row"
      >
        <template v-for="item in row">
          <td :key="'item' + item.editor.id" :class="question.cssClasses.cell">
            <survey-multipletext-item :question="question" :item="item"></survey-multipletext-item>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionMultipleTextModel } from "survey-core";

@Component
export class MultipleText extends QuestionVue<QuestionMultipleTextModel> {
}
Vue.component("survey-multipletext", MultipleText);
export default MultipleText;
</script>
