<template>
  <button
    ref="root"
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
      (args: any) => {
        item.doMouseDown(args);
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
    v-bind:aria-labelledby="item.ariaLabelledBy"
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

    <StringViewer v-if="item.hasTitle" :locString="item.locTitle" :textClass="item.getActionBarItemTitleCss()" />
  </button>
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
import type { Action } from "survey-core";
import StringViewer from "@/StringViewer.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
const props = defineProps<{ item: Action }>();
const root = ref<HTMLElement>();
useBase(() => props.item);
onMounted(() => {
    props.item.setInputElement(root.value as HTMLElement);
})
onBeforeUnmount(() => {
  props.item.setInputElement(undefined as any);
})
</script>
