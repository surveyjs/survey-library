<template>
  <div
    role="alert"
    aria-live="polite"
    v-if="element.hasVisibleErrors"
    :class="element.cssError"
    :id="element.id + '_errors'"
    ref="root"
  >
    <div v-for="(error, index) in element.errors" :key="'error_' + index">
      <span
        :class="
          element.cssClasses
            ? element.cssClasses.error.icon || undefined
            : 'panel-error-icon'
        "
        aria-hidden="true"
      ></span>
      <span
        :class="
          element.cssClasses
            ? element.cssClasses.error.item || undefined
            : 'panel-error-item'
        "
      >
        <survey-string :locString="error.locText" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PanelModel, type Question, TooltipManager } from "survey-core";
import { onUnmounted, onUpdated, ref } from "vue";

const props = defineProps<{
  element: Question | PanelModel;
  location?: string;
}>();
const root = ref<HTMLElement>();
let tooltipManager: TooltipManager;

onUpdated(() => {
  if (props.location == "tooltip" && root.value instanceof HTMLElement) {
    if (!tooltipManager || root.value !== tooltipManager.tooltipElement) {
      tooltipManager = new TooltipManager(root.value as HTMLElement);
    }
  }
  if (!(root.value instanceof HTMLElement) && !!tooltipManager) {
    tooltipManager.dispose();
  }
});
onUnmounted(() => {
  if (tooltipManager) {
    tooltipManager.dispose();
  }
});
</script>
