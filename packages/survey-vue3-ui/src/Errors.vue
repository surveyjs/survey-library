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
    <div>
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
  </div>
</template>

<script lang="ts" setup>
import type { PanelModel, Question } from "survey-core";
import { ref } from "vue";

const props = defineProps<{
  element: Question | PanelModel;
  location?: string;
}>();
const root = ref<HTMLElement>();
</script>
