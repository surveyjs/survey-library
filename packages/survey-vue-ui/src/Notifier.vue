<template>
  <div
    v-bind:class="model.css"
    v-show="model.isDisplayed"
    :style="{ visibility: model.active ? 'visible' : 'hidden' }"
    role="alert"
    aria-live="polite"
  >
    <span>{{ model.message }}</span>
    <sv-action-bar :model="model.actionBar"></sv-action-bar>
  </div>
</template>

<script lang="ts">
import type { Notifier } from "survey-core";
import { defineComponent, type PropType } from "vue";
import { BaseVue } from "./base";

export default defineComponent({
  props: {
    model: { type: Object as PropType<Notifier>, required: true },
  },
  mixins: [BaseVue],
  methods: {
    getModel() {
      return this.model;
    },
  },
});
</script>
