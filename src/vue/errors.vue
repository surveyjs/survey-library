<template>
  <div role="alert" v-show="errors.length > 0" :class="errorsClass">
    <div v-for="error in errors">
      <span :class="errorIcon" aria-hidden="true"></span>
      <span :class="errorItem">
        <survey-string :locString="error.locText"/>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question } from "../question";
import { SurveyError } from "../base";

@Component
export class Errors extends Vue {
  @Prop question: Question;
  get errors(): Array<SurveyError> {
    return !!this.question ? this.question.errors : [];
  }
  get questionCss(): any {
    return !!this.question && !!this.question.cssClasses
      ? this.question.cssClasses
      : null;
  }
  get errorsClass(): string {
    return !!this.questionCss
      ? this.questionCss.error.root
      : "panel-error-root";
  }
  get errorIcon(): string {
    return !!this.questionCss
      ? this.questionCss.error.icon
      : "panel-error-icon";
  }
  get errorItem(): string {
    return !!this.questionCss
      ? this.questionCss.error.item
      : "panel-error-item";
  }
}
Vue.component("survey-errors", Errors);
export default Errors;
</script>
