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
    v-bind:title="item.getTooltip()"
    v-bind:data-sv-tooltip="item.getTooltip()"
    v-bind:aria-checked="item.ariaChecked"
    v-bind:aria-expanded="item.ariaExpanded"
    v-bind:aria-controls="item.ariaControls"
    v-bind:aria-labelledby="item.ariaLabelledBy"
    v-bind:aria-label="item.ariaLabel"
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
    <StringViewer v-if="item.hasTitle" :model="item.locTitle" :textClass="item.getActionBarItemTitleCss()" />
    <SvComponent
      :is="'sv-svg-icon'"
      v-if="item.markerIconName"
      :className="item.cssClasses.itemMarkerIcon"
      :iconName="item.markerIconName"
      :size="'auto'"
    ></SvComponent>
  </button>
  <SvComponent v-if="item.popupModel" :is="'sv-popup'" :model="item.popupModel"></SvComponent>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
// A chip of the Filter Control: the standard action button with a trailing chevron while it opens a
// popup, and the popup right after the button (the popup is placed against its previous sibling).
import { key2ClickDirective as vKey2click } from "@/directives/key2click";
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import { type Action, ActionDropdownViewModel } from "survey-core";
import StringViewer from "@/StringViewer.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
const props = defineProps<{ item: Action }>();
const root = ref<HTMLElement>();
let viewModel: ActionDropdownViewModel | undefined;
useBase(() => props.item);
onMounted(() => {
  props.item.setInputElement(root.value as HTMLElement);
  if (props.item.popupModel) {
    viewModel = new ActionDropdownViewModel(props.item);
  }
});
onBeforeUnmount(() => {
  props.item.setInputElement(undefined as any);
  if (viewModel) {
    viewModel.dispose();
    viewModel = undefined;
  }
});
</script>
