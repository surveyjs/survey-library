<template>
  <div :key="errorKey">
    <span
      :class="
        cssClasses ? cssClasses.error.icon || undefined : 'panel-error-icon'
      "
      aria-hidden="true"
    ></span>
    <span
      :class="
        cssClasses ? cssClasses.error.item || undefined : 'panel-error-item'
      "
    >
      <SurveyVueComponent :name="'survey-string'" :locString="error.locText" />
    </span>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import { SurveyError } from "survey-core";
defineProps<{
  errorKey: string;
  error: SurveyError;
  cssClasses: any;
  element: any;
}>();
</script>
