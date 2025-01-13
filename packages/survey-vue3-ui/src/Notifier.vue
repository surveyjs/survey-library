<template>
  <div
    v-bind:class="model.css"
    v-if="model.isDisplayed"
    :style="{ visibility: model.active ? 'visible' : 'hidden' }"
    role="alert"
    aria-live="polite"
  >
    <span>{{ model.message }}</span>
    <SvComponent :is="'sv-action-bar'" :model="model.actionBar"></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { Notifier } from "survey-core";
import { useBase } from "./base";

const props = defineProps<{ model: Notifier }>();

useBase(() => props.model);
</script>
