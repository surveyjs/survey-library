<template>
  <div :class="question.cssClasses.root">{{ question.formatedValue }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionExpressionModel } from "survey-core";

@Component
export class Expression extends QuestionVue<QuestionExpressionModel> {}
Vue.component("survey-expression", Expression);
export default Expression;
</script>
