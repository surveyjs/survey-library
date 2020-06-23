<template>
  <div role="alert" v-show="isShow" :class="classes" :id="question.id + '_errors'">
    <div v-for="error in question.errors">
      <span
        :class="question.cssClasses ? question.cssClasses.error.icon : 'panel-error-icon'"
        aria-hidden="true"
      ></span>
      <span :class="question.cssClasses ? question.cssClasses.error.item : 'panel-error-item'">
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
  @Prop location: String;

  get isShow() {
    return !!this.question.errors && this.question.errors.length > 0
  }

  get classes() {
    var question = this.question;
    var classes = question.cssClasses
      ? question.cssClasses.error.root
      : "panel-error-root";

    var additionalClasses = "";

    if (this.location === "top") {
      additionalClasses = question.cssClasses.error.locationTop;
    } else if (this.location === "bottom") {
      additionalClasses = question.cssClasses.error.locationBottom;
    }

    if (additionalClasses) classes += " " + additionalClasses;

    return classes;
  }
}
Vue.component("survey-errors", Errors);
export default Errors;
</script>
