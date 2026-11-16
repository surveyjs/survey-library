<template>
  <div :class="item.boxCss">
    <ActionBarItem :item="item"></ActionBarItem>
    <SvComponent v-if="item.popupModel" :is="'sv-popup'" :model="item.popupModel"></SvComponent>
    <ActionBarItem v-if="item.isClearable" :item="item.clearAction"></ActionBarItem>
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
// A chip of the Filter Control (FilterChip): the standard action button (its trailing chevron is the
// item's markerIconName), the popup right after the button (the popup is placed against its previous
// sibling) and, while the chip can be cleared, its cross - a button of its own, which the theme draws
// over the chip's end. The button sets the item's input element itself: a child mounts before its
// parent.
import SvComponent from "@/SvComponent.vue";
import ActionBarItem from "@/components/action-bar/ActionBarItem.vue";
import { useBase } from "@/base";
import { type FilterChip, ActionDropdownViewModel } from "survey-core";
import { onBeforeUnmount, onMounted } from "vue";
const props = defineProps<{ item: FilterChip }>();
let viewModel: ActionDropdownViewModel | undefined;
useBase(() => props.item);
onMounted(() => {
  if (props.item.popupModel) {
    viewModel = new ActionDropdownViewModel(props.item);
  }
});
onBeforeUnmount(() => {
  if (viewModel) {
    viewModel.dispose();
    viewModel = undefined;
  }
});
</script>
