<template>
  <button
    :class="item.getActionBarItemCss()"
    type="button"
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
    v-bind:disabled="item.enabled !== undefined && !item.enabled"
    v-bind:title="item.tooltip || item.title"
    v-bind:aria-checked="item.ariaChecked"
    v-bind:aria-expanded="item.ariaExpanded"
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

    <span v-if="item.hasTitle" :class="item.getActionBarItemTitleCss()">{{
      item.title
    }}</span>
  </button>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import type { Action } from "survey-core";
const props = defineProps<{ item: Action }>();
useBase(() => props.item);
</script>
