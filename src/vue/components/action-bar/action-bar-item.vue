<template>
  <button
    class="sv-action-bar-item"
    v-on:click="
      () => {
        item.action();
      }
    "
    v-bind:class="[
      { 'sv-action-bar-item--active': item.isActive },
      item.innerCss,
    ]"
    v-bind:disabled="item.enabled !== undefined && !item.enabled"
    v-bind:title="item.tooltip || item.title"
    v-bind:tabindex="item.disableTabStop ? -1 : undefined"
  >
    <sv-svg-icon
      v-if="item.iconName"
      class="sv-action-bar-item__icon"
      :iconName="item.iconName"
      :size="24"
    ></sv-svg-icon>

    <span
      v-if="item.showTitle === undefined || item.showTitle || !item.iconName"
      class="sv-action-bar-item__title"
      v-bind:class="{ 'sv-action-bar-item__title--with-icon': !!item.iconName }"
      >{{ item.title }}</span
    >
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { Action } from "survey-core";
import { Base } from "survey-core";
import BaseVue from "../../base";

@Component
export class ActionBarItemViewModel extends BaseVue {
  @Prop() public item: Action;

  getModel(): Base {
    return this.item;
  }
}

Vue.component("sv-action-bar-item", ActionBarItemViewModel);
export default ActionBarItemViewModel;
</script>
