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
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { Action, ActionContainer } from "survey-core";
import { BaseVue } from "../../base";

export * from "./action.vue";
export * from "./action-bar-item.vue";
export * from "./action-bar-item-dropdown.vue";
export * from "./action-bar-separator.vue";

@Component
export class ActionBarViewModel extends BaseVue {
  @Prop() model: ActionContainer;
  @Prop() container: string;
  @Prop() handleClick: boolean;
  constructor(props: any) {
    super(props);
  }
  getModel(): ActionContainer<Action> {
    return this.model;
  }

  mounted() {
    if (!this.model.hasActions) return;
    const container: HTMLDivElement = <HTMLDivElement>this.$el;
    this.model.initResponsivityManager(container);
  }

  beforeDestroy() {
    this.model.resetResponsivityManager();
  }
}

Vue.component("sv-action-bar", ActionBarViewModel);
export default ActionBarViewModel;
</script>
