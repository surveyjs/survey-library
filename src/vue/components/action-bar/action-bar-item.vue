<template>
  <button
    :class="item.getActionBarItemCss()"
    type="button"
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
    v-bind:disabled="item.disabled"
    v-bind:title="item.tooltip || item.title"
    v-bind:aria-checked="item.ariaChecked"
    v-bind:aria-expanded="item.ariaExpanded"
    v-bind:role="item.ariaRole"
    v-bind:tabindex="item.disableTabStop ? -1 : 0"
    v-key2click="{ processEsc: false, disableTabStop: item.disableTabStop }"
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
