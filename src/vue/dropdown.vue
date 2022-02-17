<template>
  <div :class="question.renderCssRoot">
    <div v-if="!question.isReadOnly" :class="question.cssClasses.selectWrapper">
        <sv-dropdown :question="question" ></sv-dropdown>
    </div><div
      disabled
      v-else
      :id="question.inputId"
      :class="question.getControlClass()"
    >{{ question.readOnlyText }}</div><survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionDropdownModel } from "survey-core";

@Component
export class Dropdown extends QuestionVue<QuestionDropdownModel> {
}
Vue.component("survey-dropdown", Dropdown);
export default Dropdown;
</script>
