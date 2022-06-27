<template>
  <div :class="question.renderCssRoot">
    <sv-dropdown :question="question"></sv-dropdown>
    <survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionDropdownModel } from "survey-core";

@Component
export class DropdownSelect extends QuestionVue<QuestionDropdownModel> {}
Vue.component("survey-dropdown", DropdownSelect);
export default DropdownSelect;
</script>
