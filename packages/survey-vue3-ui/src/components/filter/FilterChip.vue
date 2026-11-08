<template>
  <ActionBarItem :item="item"></ActionBarItem>
  <SvComponent v-if="item.popupModel" :is="'sv-popup'" :model="item.popupModel"></SvComponent>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
// A chip of the Filter Control: the standard action button (its trailing chevron is the item's
// markerIconName), and the popup right after the button (the popup is placed against its previous
// sibling). The button sets the item's input element itself: a child mounts before its parent.
import SvComponent from "@/SvComponent.vue";
import ActionBarItem from "@/components/action-bar/ActionBarItem.vue";
import { useBase } from "@/base";
import { type Action, ActionDropdownViewModel } from "survey-core";
import { onBeforeUnmount, onMounted } from "vue";
const props = defineProps<{ item: Action }>();
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
