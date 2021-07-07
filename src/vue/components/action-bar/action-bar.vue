<template>
  <div
    v-if="model.hasItems"
    ref="container"
    class="sv-action-bar"
    v-on:click="
      event => {
        event.stopPropagation();
      }
    "
  >
    <span
      class="sv-action"
      v-bind:class="{ 'sv-action--hidden': !item.isVisible }"
      v-for="item in model.actions"
      :key="item.id"
      v-show="item.visible || item.visible === undefined"
    >
      <sv-action-bar-separator
        v-if="item.needSeparator"
      ></sv-action-bar-separator>
      <component :is="getComponentName(item)" :item="item"> </component>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { AdaptiveActionContainer } from "survey-core";

export * from "./action-bar-item.vue";
export * from "./action-bar-item-dropdown.vue";
export * from "./action-bar-separator.vue";

@Component
export class ActionBarViewModel extends Vue {
  @Prop() model: AdaptiveActionContainer;
  @Prop() handleClick: boolean;
  
  getComponentName(item: any) {
    return item.component || "sv-action-bar-item";
  }
}

Vue.component("sv-action-bar", ActionBarViewModel);
export default ActionBarViewModel;
</script>
