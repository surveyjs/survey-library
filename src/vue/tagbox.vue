<template>
  <div :class="question.renderCssRoot">
    <sv-tagbox :question="question"></sv-tagbox>
    <survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionTagboxModel } from "survey-core";

@Component
export class Tagbox extends QuestionVue<QuestionTagboxModel> {}

Vue.component("survey-tagbox", Tagbox);

export default Tagbox;
</script>
