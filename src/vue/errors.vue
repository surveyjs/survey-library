<template>
  <div
    role="alert"
    v-show="question.hasVisibleErrors"
    :class="classes"
    :id="question.id + '_errors'"
  >
    <div v-for="error in question.errors">
      <span
        :class="
          question.cssClasses
            ? question.cssClasses.error.icon
            : 'panel-error-icon'
        "
        aria-hidden="true"
      ></span>
      <span
        :class="
          question.cssClasses
            ? question.cssClasses.error.item
            : 'panel-error-item'
        "
      >
        <survey-string :locString="error.locText" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question } from "survey-core";
import { CssClassBuilder } from "src/utils/cssClassBuilder";

@Component
export class Errors extends Vue {
  @Prop() question: Question;
  @Prop() location: String;

  get classes() {
    const question = this.question;
    return new CssClassBuilder()
      .append(question.cssClasses ? question.cssClasses.error.root : "panel-error-root")
      .append(question.cssClasses.error.locationTop, this.location === "top")
      .append(question.cssClasses.error.locationBottom, this.location === "bottom")
      .toString();
  }
}
Vue.component("survey-errors", Errors);
export default Errors;
</script>
