<template>
  <div
    v-if="model.hasActions"
    ref="container"
    :class="model.css"
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
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { Action, AdaptiveActionContainer, ResponsivityManager } from "survey-core";
import { BaseVue } from "../../base";

export * from "./action.vue";
export * from "./action-bar-item.vue";
export * from "./action-bar-item-dropdown.vue";
export * from "./action-bar-separator.vue";

@Component
export class ActionBarViewModel extends BaseVue {
  @Prop() model: AdaptiveActionContainer;
  @Prop() handleClick: boolean;
  constructor(props: any) {
    super(props);
  }
  manager: ResponsivityManager;
  getModel(): AdaptiveActionContainer<Action> {
    return this.model;
  }
  
  mounted() {
    if (!this.model.hasActions) return;
    const container = this.$el;
    this.manager = new ResponsivityManager(
      container as HTMLDivElement,
      (this.model as any),
      ".sv-action:not(.sv-dots)>.sv-action__content"
    );
  }

  beforeDestroy() {
    this.manager && this.manager.dispose();
  }
}

Vue.component("sv-action-bar", ActionBarViewModel);
export default ActionBarViewModel;
</script>
