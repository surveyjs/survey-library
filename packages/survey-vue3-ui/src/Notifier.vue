<template>
  <div
    v-bind:class="model.css"
    v-if="model.isDisplayed"
    :style="{ visibility: model.active ? 'visible' : 'hidden' }"
    role="alert"
    aria-live="polite"
  >
    <span>{{ model.message }}</span>
    <SurveyVueComponent
      :name="'sv-action-bar'"
      :model="model.actionBar"
    ></SurveyVueComponent>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import type { Notifier } from "survey-core";
import { useBase } from "./base";

const props = defineProps<{ model: Notifier }>();

useBase(() => props.model);
</script>
