<template>
  <div v-if="hasItems" ref="container" class="sv-action-bar">
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
import { ObjectWrapper } from "../../../utils/objectwrapper";
import { ResponsibilityManager } from "../../../utils/resonsibilitymanager";
import { computed } from "knockout";
import { IActionBarItem } from "../../../base";

export * from "./action-bar-item.vue";
export * from "./action-bar-separator.vue";

@Component
export class ActionBar extends Vue {
  private updateVisibleItems: any;
  @Prop items: Array<IActionBarItem>;

  constructor() {
    super();
  }

  get wrappedItems() {
    var items: any[] = [];
    this.items.forEach((item) => {
      (<any>item).isVisible = true;
      var wrappedItem: any = new ObjectWrapper(item, ["action", "showTitle"]);
      items.push(wrappedItem);
    });
    return items;
  }

  getComponentName(item: any) {
    return item.component || "sv-action-bar-item";
  }

  get hasItems() {
    return (this.items || []).length > 0;
  }
}

Vue.component("sv-action-bar", ActionBar);
export default ActionBar;
</script>
