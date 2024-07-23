<template>
  <button
    :class="item.getActionBarItemCss()"
    type="button"
    v-on:click="
      (args: any) => {
        item.doAction(args);
      }
    "
    v-on:keyup="
      (evt) => {
        evt.stopPropagation();
      }
    "
    v-on:mousedown="
      () => {
        item.doMouseDown();
      }
    "
    v-on:focus="
      (event) => {
        item.doFocus(event);
      }
    "
    v-bind:disabled="item.disabled"
    v-bind:title="item.tooltip || item.title"
    v-bind:aria-checked="item.ariaChecked"
    v-bind:aria-expanded="item.ariaExpanded"
    v-bind:role="item.ariaRole"
    v-key2click="{ processEsc: false, disableTabStop: item.disableTabStop }"
  >
    <SurveyVueComponent
      :name="'sv-svg-icon'"
      v-if="item.iconName"
      :class="item.cssClasses.itemIcon"
      :iconName="item.iconName"
      :size="item.iconSize"
      :title="item.tooltip || item.title"
    ></SurveyVueComponent>

    <span v-if="item.hasTitle" :class="item.getActionBarItemTitleCss()">{{
      item.title
    }}</span>
  </button>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import { useBase } from "@/base";
import type { Action } from "survey-core";
const props = defineProps<{ item: Action }>();
useBase(() => props.item);
</script>
