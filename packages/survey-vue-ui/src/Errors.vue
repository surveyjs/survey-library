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
import { SurveyElement, TooltipManager, Base, Question, PanelModel } from "survey-core";
import { defineSurveyComponent } from "./base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-errors",
  props: {
    element: Object,
    location: String,
  },
  data: (vm: any) => {
    return {
      tooltipManager: undefined,
      getModel: () => { return vm.element; }
    }
  },
  updated() {
    if (this.location == "tooltip" && this.$el instanceof HTMLElement) {
      if (!this.tooltipManager || this.$el !== this.tooltipManager.tooltipElement) {
        this.tooltipManager = new TooltipManager(<HTMLElement>this.$el);
      }
    }
    if (!(this.$el instanceof HTMLElement) && !!this.tooltipManager) {
      this.tooltipManager.dispose();
    }
  },
  unmounted() {
    if (!!this.tooltipManager) {
      this.tooltipManager.dispose();
    }
  }

});

</script>
