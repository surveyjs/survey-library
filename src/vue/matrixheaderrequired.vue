<template>
  <span class="sv-vue-title-additional-div" v-if="column.isRenderedRequired">
    <span>&nbsp;</span>
    <span :class="question.cssClasses.cellRequiredText">{{ column.requiredText }}</span>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { BaseVue } from "./base";
import { Base } from "survey-core";
import {
  Question,
  MatrixDropdownColumn
} from "survey-core";

@Component
export class MatrixHeaderRequired extends BaseVue {
  @Prop() question: Question;
  @Prop() column: MatrixDropdownColumn;

  protected getModel(): Base {
    return this.column;
  }
}

Vue.component("survey-matrixheaderrequired", MatrixHeaderRequired);
export default MatrixHeaderRequired;
</script>
