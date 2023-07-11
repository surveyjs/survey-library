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
import { TooltipManager } from "survey-core";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-errors",
  props: {
    element: { type: Object, required: true },
    location: String,
  },
  setup() {
    return {
      tooltipManager: (undefined as any as TooltipManager),
    };
  },
  updated() {
    if (this.location == "tooltip" && this.$el instanceof HTMLElement) {
      if (!this.tooltipManager || this.$el !== this.tooltipManager.tooltipElement) {
        this.tooltipManager = new TooltipManager(this.$el as HTMLElement);
      }
    }
    if (!(this.$el instanceof HTMLElement) && !!this.tooltipManager) {
      this.tooltipManager.dispose();
    }
  },
  unmounted() {
    if (this.tooltipManager) {
      this.tooltipManager.dispose();
    }
  },
});
</script>
