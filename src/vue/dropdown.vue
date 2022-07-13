<template>
  <div :class="question.renderCssRoot">
    <sv-dropdown :question="question"></sv-dropdown>
    <survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionDropdownModel } from "survey-core";

@Component
export class Dropdown extends QuestionVue<QuestionDropdownModel> {}

Vue.component("survey-dropdown", Dropdown);

export default Dropdown;
</script>
