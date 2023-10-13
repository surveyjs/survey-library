<template>
  <table :class="question.getQuestionRootCss()">
    <tbody>
      <template
        v-for="(row, rowIndex) in question.getRows()"
      >
        <tr :class="question.cssClasses.row" v-if="row.isVisible" :key="question.inputId + 'rowkey' + rowIndex">
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
