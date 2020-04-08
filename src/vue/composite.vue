<template>
  <div>
    <div>
      <survey-element
        :key="contentPanel.idValue"
        :id="contentPanel.id"
        :role="contentPanel.ariaRole"
        :aria-labelledby="contentPanel.id + '_aria'"
        :name="contentPanel.name"
        :style="{ width: '100%' }"
        :element="contentPanel"
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
import { QuestionCompositeModel } from "../question_custom";

@Component
export class Composite extends QuestionVue<QuestionCompositeModel> {
  get contentPanel() {
    return this.question.contentPanel;
  }
}
Vue.component("survey-composite", Composite);

export default Composite;
</script>
