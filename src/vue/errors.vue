<template>
  <div
    role="alert"
    aria-live="polite"
    v-show="element.hasVisibleErrors"
    :class="element.cssError"
    :id="element.id + '_errors'"
  >
    <div v-for="(error, index) in element.errors" :key="'error_' + index">
      <span
        :class="
          element.cssClasses
            ? element.cssClasses.error.icon
            : 'panel-error-icon'
        "
        aria-hidden="true"
      ></span>
      <span
        :class="
          element.cssClasses
            ? element.cssClasses.error.item
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
import { SurveyElement } from "survey-core";

@Component
export class Errors extends Vue {
  @Prop() element: SurveyElement;
  @Prop() location: String;
}
Vue.component("survey-errors", Errors);
export default Errors;
</script>
