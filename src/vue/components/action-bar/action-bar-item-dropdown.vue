<template>
  <div style="width: 100%">
    <button
      ref="targetRef"
      type="button"
      :class="item.getActionBarItemCss()"
      v-on:click="
        (args) => {
          item.action(item, !!args.pointerType);
        }
      "
      v-on:keyup="
        (evt) => {
          evt.stopPropagation();
        }
      "
      v-bind:disabled="item.enabled !== undefined && item.enabled"
      v-bind:title="item.tooltip || item.title"
      v-bind:role="item.ariaRole"
      v-bind:tabindex="item.disableTabStop ? -1 : 0"
    >
      <sv-svg-icon
        v-if="item.iconName"
        :class="item.cssClasses.itemIcon"
        :iconName="item.iconName"
        :size="item.iconSize"
        :title="item.tooltip || item.title"
      ></sv-svg-icon>

      <span
        v-if="item.hasTitle"
        :class="item.getActionBarItemTitleCss()"
        >{{ item.title }}</span
      >
    </button>
    <sv-popup 
      :model="item.popupModel" 
      :targetElement="targetElementRef"></sv-popup>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import ActionBarItemViewModel from "./action-bar-item.vue";
import { ActionDropdownViewModel } from "survey-core";

@Component
export class ActionBarItemDropdownViewModel extends ActionBarItemViewModel {
  private viewModel: ActionDropdownViewModel;
  public targetElementRef: { setCurrent?: (currentEl: HTMLElement) => void } = { };
  constructor() {
    super();
    this.viewModel = new ActionDropdownViewModel(this.item);
  }
  onMounted() {
    this.targetElementRef.setCurrent && this.targetElementRef.setCurrent(this.$refs.targetRef as any);
  }
  onDestroyed() {
    this.viewModel.dispose();
  }
}
Vue.component("sv-action-bar-item-dropdown", ActionBarItemDropdownViewModel);
export default ActionBarItemDropdownViewModel;
</script>
