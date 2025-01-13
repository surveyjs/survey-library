<template>
  <button
    type="button"
    :class="item.getActionBarItemCss()"
    v-on:click="
      (args: any) => {
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
    v-bind:role="item.ariaRole"
    v-key2click="{ processEsc: false, disableTabStop: item.disableTabStop }"
  >
    <SvComponent
      :is="'sv-svg-icon'"
      v-if="item.iconName"
      :class="item.cssClasses.itemIcon"
      :iconName="item.iconName"
      :size="item.iconSize"
      :title="item.tooltip || item.title"
    ></SvComponent>

    <span v-if="item.hasTitle" :class="item.getActionBarItemTitleCss()">{{
      item.title
    }}</span>
  </button>
  <SvComponent
    :is="'sv-popup'"
    :model="item.popupModel"
  ></SvComponent>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import { key2ClickDirective as vKey2click } from "@/directives/key2click";
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import {
  type Action,
  ActionDropdownViewModel,
  getActionDropdownButtonTarget,
} from "survey-core";
const props = defineProps<{ item: Action }>();
let viewModel = undefined as any as ActionDropdownViewModel;

useBase(
  () => props.item,
  (newValue) => {
    viewModel = new ActionDropdownViewModel(newValue);
  },
  () => {
    viewModel.dispose();
  }
);
</script>
