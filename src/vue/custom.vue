<template>
  <component
    :is="getComponentName(contentQuestion)"
    :question="contentQuestion"
    :css="css"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue, getComponentName } from "./question";
import { Question } from "survey-core";
import { QuestionCustomModel } from "survey-core";

@Component
export class Custom extends QuestionVue<QuestionCustomModel> {
  get contentQuestion(): Question {
    return this.question.contentQuestion;
  }
  getComponentName(element: Question): string {
    return getComponentName(element);
  }
}
Vue.component("survey-custom", Custom);

export default Custom;
</script>
