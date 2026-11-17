<template>
  <div :class="item.boxCss">
    <ActionBarItem :item="item"></ActionBarItem>
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
// item's markerIconName) and, while the chip can be cleared, its cross - a button of its own, which
// the theme draws over the chip's end. Its popup is drawn by the control, next to the chips' action bar
// (see QuestionFilterModel.popupChips); the chip only shows that the popup is open. The button sets the
// item's input element - the element the popup stands against - itself.
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
