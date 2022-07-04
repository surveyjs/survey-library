<template>
  <button
    type="button"
    :class="item.getActionBarItemCss()"
    v-on:click="
      () => {
        item.action();
      }
    "
    v-on:keyup="
      (evt) => {
        evt.stopPropagation();
      }
    "
    v-bind:disabled="item.enabled !== undefined && item.enabled"
    v-bind:title="item.tooltip || item.title"
  >
    <sv-svg-icon
      v-if="item.iconName"
      :class="item.cssClasses.itemIcon"
      :iconName="item.iconName"
      :size="item.iconSize"
      :title="item.tooltip || item.title"
    ></sv-svg-icon>

    <span
      v-if="item.showTitle === undefined || item.showTitle || !item.iconName"
      :class="item.getActionBarItemTitleCss()"
      >{{ item.title }}</span
    >
    <sv-popup :model="item.popupModel"></sv-popup>
  </button>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import ActionBarItemViewModel from "./action-bar-item.vue";
import { ActionDropdownViewModel } from "survey-core";

@Component
export class ActionBarItemDropdownViewModel extends ActionBarItemViewModel {
  private viewModel: ActionDropdownViewModel;
  constructor() {
    super();
    this.viewModel = new ActionDropdownViewModel(this.item);
  }
  onDestroyed() {
    this.viewModel.dispose();
  }
}
Vue.component("sv-action-bar-item-dropdown", ActionBarItemDropdownViewModel);
export default ActionBarItemDropdownViewModel;
</script>
