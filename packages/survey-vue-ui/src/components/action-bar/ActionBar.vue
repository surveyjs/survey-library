<template>
  <div
    v-if="model.hasActions"
    ref="container"
    :class="model.getRootCss()"
    v-on:click="
      (event) => {
        event.stopPropagation();
      }
    "
  >
    <sv-action
      v-for="item in model.renderedActions"
      v-bind:key="item.id"
      :item="item"
    ></sv-action>
  </div>
</template>

<script lang="ts">
import { ActionContainer } from "survey-core";
import { BaseVue } from "../../base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-action-bar",
  props: {
    model: { type: Object as PropType<ActionContainer>, required: true },
    handleClick: Boolean,
  },
  mixins: [BaseVue],
  mounted() {
    if (!this.model.hasActions) return;
    const container = this.$el;
    this.model.initResponsivityManager(container);
  },
  beforeUnmount() {
    this.model.resetResponsivityManager();
  },
  methods: {
    getModel() {
      return this.model;
    },
  },
});
</script>
