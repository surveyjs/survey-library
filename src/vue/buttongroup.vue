<template>
  <div role="group" :class="question.cssClasses.root">
    <template v-for="(item, index) in question.visibleChoices">
      <sv-button-group-item
        :item="item"
        :question="question"
        :index="index"
        :key="question.inputId + '_' + index"
      ></sv-button-group-item>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { QuestionButtonGroupModel } from "survey-core";
import { QuestionVue } from "./question";

@Component
export class ButtonGroup extends QuestionVue<QuestionButtonGroupModel> {
  @Prop() question: QuestionButtonGroupModel;

  getModel(): QuestionButtonGroupModel {
    return this.question;
  }
}
// Vue.component("survey-buttongroup", ButtonGroup);
export default ButtonGroup;
</script>
