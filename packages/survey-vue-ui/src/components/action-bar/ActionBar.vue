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
import { defineSurveyComponent } from "../../base";
import type { PropType } from "vue";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "sv-action-bar",
  props: {
    model: Object as PropType<ActionContainer>,
    handleClick: Boolean
  },
  computed: {
    componentName() {
      return this.item.component || "sv-action-bar-item";
    },
  },
  mounted() {
    if (!this.model.hasActions) return;
    const container = this.$el;
    this.model.initResponsivityManager(container);
  },
  beforeUnmount() {
    this.model.resetResponsivityManager();
  },
  data: (vm: any) => {
    return {
      getModel: () => {
        return vm.model;
      },
    };
  },
});
</script>
