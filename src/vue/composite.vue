<template>
  <survey-panel :question="contentPanel" :css="css" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionCompositeModel, PanelModel } from "survey-core";

@Component
export class Composite extends QuestionVue<QuestionCompositeModel> {
  get contentPanel(): PanelModel {
    return this.question.contentPanel;
  }
}
Vue.component("survey-composite", Composite);

export default Composite;
</script>
