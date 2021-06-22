<template>
  <div
    v-if="hasItems"
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
      v-for="item in wrappedItems"
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
import { ActionBar, IActionBarItem, AdaptiveActionBarItemWrapper } from "survey-core";

export * from "./action-bar-item.vue";
export * from "./action-bar-item-dropdown.vue";
export * from "./action-bar-separator.vue";

@Component
export class ActionBarViewModel extends Vue {
  @Prop() items: Array<IActionBarItem>;
  @Prop() handleClick: boolean;
  private model = new ActionBar();

  constructor() {
    super();
    this.model.setItems(this.items);
  }

  get wrappedItems(): AdaptiveActionBarItemWrapper[] {
    return this.model.items;
  }

  getComponentName(item: any) {
    return item.component || "sv-action-bar-item";
  }

  get hasItems() {
    return (this.model.items || []).length > 0;
  }
}

Vue.component("sv-action-bar", ActionBarViewModel);
export default ActionBarViewModel;
</script>
