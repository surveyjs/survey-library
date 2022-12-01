<template>
  <div
    role="alert"
    aria-live="polite"
    v-if="element.hasVisibleErrors"
    :class="element.cssError"
    :id="element.id + '_errors'"
  >
    <div v-for="(error, index) in element.errors" :key="'error_' + index">
      <span
        :class="element.cssClasses ? element.cssClasses.error.icon || undefined : 'panel-error-icon'"
        aria-hidden="true"
      ></span>
      <span
        :class="element.cssClasses ? element.cssClasses.error.item || undefined: 'panel-error-item'"
      >
        <survey-string :locString="error.locText" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { BaseVue } from "./base";
import { Component, Prop } from "vue-property-decorator";
import { SurveyElement, TooltipManager, Base, Question, PanelModel } from "survey-core";

@Component
export class Errors extends BaseVue {
  @Prop() element: Question | PanelModel;
  @Prop() location: String;
  private tooltipManager: TooltipManager;
  protected getModel(): Base {
    return this.element;
  }
  updated() {
    if (this.location == "tooltip" && this.$el instanceof HTMLElement) {
      if (!this.tooltipManager || this.$el !== this.tooltipManager.tooltipElement) {
        this.tooltipManager = new TooltipManager(<HTMLElement>this.$el);
      }
    }
    if (!(this.$el instanceof HTMLElement) && !!this.tooltipManager) {
      this.tooltipManager.dispose();
    }
  }
  destroyed() {
    if (!!this.tooltipManager) {
      this.tooltipManager.dispose();
    }
  }
}
Vue.component("survey-errors", Errors);
export default Errors;
</script>
