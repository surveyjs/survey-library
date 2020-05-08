<template>
  <component :is="getWidgetComponentName(contentQuestion)" :question="contentQuestion" :css="css" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { Question } from "../question";
import { QuestionCustomModel } from "../question_custom";

@Component
export class Custom extends QuestionVue<QuestionCustomModel> {
  get contentQuestion(): Question {
    return this.question.contentQuestion;
  }
  getWidgetComponentName(element: Question): string {
    if (element.customWidget) {
      return "survey-customwidget";
    }
    return "survey-" + element.getTemplate();
  }
}
Vue.component("survey-custom", Custom);

export default Custom;
</script>
