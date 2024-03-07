<template>
  <div v-if="question.isReadOnlyRenderDiv()">{{ question.value }}</div>
  <div v-else-if="question.dataListId">
    <survey-text-input :question="question"/>
    <datalist :id="question.dataListId">
      <option v-for="(item, index) in question.dataList" v-bind:key="index" :value="item"></option>
    </datalist>
  </div>
  <survey-text-input v-else :question="question"/>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionTextModel } from "survey-core";

@Component
export class QuestionText extends QuestionVue<QuestionTextModel> {}
Vue.component("survey-text", QuestionText);
export default QuestionText;
</script>
