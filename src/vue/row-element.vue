<template>
  <div :style="element.rootStyle">
    <survey-element v-if="!element.isPanel" :key="element.id" :element="element" :survey="survey" :css="css" :row="row"
      :style="element.getRootStyle()">
    </survey-element>
    <survey-panel v-if="element.isPanel" :key="element.id" :question="element" :css="css">
    </survey-panel>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "survey-core";
import { QuestionRowModel } from "survey-core";
import { BaseVue } from "./base";
import { Base } from "survey-core";

@Component
export class SurveyRowElement extends BaseVue {
  @Prop() element: any;
  @Prop() row: QuestionRowModel;
  @Prop() css: any;
  @Prop() survey: SurveyModel;

  protected getModel(): Base {
    return this.element;
  }
}
Vue.component("survey-row-element", SurveyRowElement);
export default SurveyRowElement;
</script>
