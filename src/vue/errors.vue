<template>
  <div
    role="alert"
    aria-live="polite"
    v-if="element.hasVisibleErrors"
    :class="element.cssError"
    :id="element.id + '_errors'"
  >
    <component
      v-for="(error, index) in element.errors"
      :is="element.survey['questionErrorComponent']"
      :element="element"
      :key="'error_' + index"
      :errorKey="'error_' + index"
      :error="error"
      :cssClasses="element.cssClasses"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { BaseVue } from "./base";
import { Component, Prop } from "vue-property-decorator";
import { Base, Question, PanelModel } from "survey-core";

@Component
export class Errors extends BaseVue {
  @Prop() element: Question | PanelModel;
  @Prop() location: String;
  protected getModel(): Base {
    return this.element;
  }
}
Vue.component("survey-errors", Errors);
export default Errors;
</script>
