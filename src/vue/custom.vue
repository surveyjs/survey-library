<template>
  <div>
    <div>
      <survey-element
        :key="contentQuestion.idValue"
        :id="contentQuestion.id"
        :role="contentQuestion.ariaRole"
        :aria-labelledby="contentQuestion.id + '_aria'"
        :name="contentQuestion.name"
        :style="{ width: '100%' }"
        :element="contentQuestion"
        :survey="question.survey"
        :css="css"
      />
    </div>
  </div>
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
}
Vue.component("survey-custom", Custom);

export default Custom;
</script>
