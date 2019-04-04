<template>
    <table :class="question.cssClasses.root">
        <tr v-for="(row, rowindex) in question.getRows()" :key="question.inputId + 'rowkey' + rowindex" :class="question.cssClasses.row">
            <template v-for="item in row">
                <td :key="'label' + item.editor.id" :class="question.cssClasses.itemTitle"><survey-string :locString="item.locTitle"/></td>
                <td :key="item.editor.id">
                    <survey-errors :question="item.editor" />
                    <component :is="getWidgetComponentName(item.editor)" :question="item.editor" />
                </td>
            </template>
        </tr>
    </table>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { Question } from "../question";
import { QuestionMultipleTextModel } from "../question_multipletext";

@Component
export class MultipleText extends QuestionVue<QuestionMultipleTextModel> {
  getWidgetComponentName(question: Question) {
    if (question.customWidget) {
      return "survey-customwidget";
    }
    return "survey-text";
  }
}
Vue.component("survey-multipletext", MultipleText);
export default MultipleText;
</script>
